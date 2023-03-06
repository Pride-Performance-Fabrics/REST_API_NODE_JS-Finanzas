const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const data = require('../../database/conection');
const crypterService = require('../../services/crypto');
const querys = require('../../services/querys');

const {getDateString} = require('../../services/fechasServices')

router.post("/",async(req, res) =>{

    console.log("entro aqui en mail")
    try {
        const tokenInfo = crypterService.verifyJWK(req);
        if (tokenInfo.auth) {
            let transporter = nodemailer.createTransport({
                host: 'mail.ppf.com.hn',
                secure: true,
                secureConnection: false,
                auth:{
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL
                },
            });
            let mailOptions = {
                from: `"IPS Support" <${process.env.USER_MAIL}> `,
                to: req.body.to,
                cc: req.body.cc,
                subject:req.body.subject,
                html: req.body.html,
                // attachments: req.body.attachments
            }
            transporter.sendMail(mailOptions, (error, info) =>{
                if(error){
                    res.send({data: false, token: tokenInfo.token});
                    res.end();
                }
                else{
                    console.log("Email enviado")
                    res.status(200)
                    res.send({data: true, token: tokenInfo.token});
                }
            });
            // console.log(req.body)
            // res.send({data: true, token: tokenInfo.token});
            // res.end();
            
        } else {
            res.send({
                auth: false
            })
            res.end()
        }

    } catch (error) {
        console.error(error);
        res.send({
            auth: false,
            error: error
        })
        res.end()
    }
})

//************************************ ENVIAR UN CORREO CON LOS PAGOS PENDIENTES A REALIZAR */

router.get("/correoPagos",async(req, res) =>{
    let correos=[]
    const usuarios= await querys.executeQuery("SELECT idUser, Usuario, UserName, IdRol, Mail FROM Finanzas.dbo.Users WHERE IdRol in (2) AND Status = 1", req);
//    const usuarios= await querys.executeQuery("SELECT idUser, Usuario, UserName, IdRol, Mail FROM Finanzas.dbo.Users WHERE idUser in (1) AND Status = 1", req);
    usuarios.data.map((e)=>{
        correos.push(e.Mail)
    })

   console.log(correos)
   const pagos = await querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_PagosPendientes] ORDER BY vta_PagosPendientes.endDate ASC`, req);
   console.log(pagos)

  let pagosPendientes = ''
   pagos.data.forEach((e) =>{
    pagosPendientes +=  `<tr style="height: 25px;">
         <td  prewrap style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)" >${e.title}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${getDateString(e.startDate)}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${getDateString(e.endDate)}</td>
         <td align="center" style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.Priority}</td>
         <td align="center" style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.StatusName}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.notes}</td>
     </tr>`
 })

 let fecha = new Date()
 console.log(getDateString(fecha))

    console.log("entro aqui en mail")
    try {
        const tokenInfo = crypterService.verifyJWK(req);
        if (tokenInfo.auth) {
            let transporter = nodemailer.createTransport({
                host: 'mail.ppf.com.hn',
                secure: true,
                secureConnection: false,
                auth:{
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL
                },
            });
            let mailOptions = {
                from: `"IPS Support" <${process.env.USER_MAIL}> `,
                to: correos,
                cc: 'ldiscua@ppf.com.hn, lmedina@ppf.com.hn',
                subject:"Programación de Pagos Pendientes",
                html: `
                <table style="width: 80%; border-collapse:colapso ;padding:5px">
                <thead>
                    <tr style="border:1px sólido #C0C0C0; height: 30px;">
                        <th wrap style="background:#F0F0F0; width: 20%">Titulo</th>
                        <th style="background:#F0F0F0; width: 15%">Fecha Inicio    </th>
                        <th style="background:#F0F0F0;width: 15%">Fecha Vencimiento</th>
                        <th style="background:#F0F0F0; width: 8%">Prioridad</th>
                        <th  style="background:#F0F0F0; width: 8%;">Estado</th>
                        <th style="background:#F0F0F0; width: 30%">Nota</th>
                    </tr>
                </thead>
                <tbody >
                    ${pagosPendientes.toString()}
                </tbody>
                <!-- <tfoot>Fecha: </tfoot> -->
               
               
            </table>`,
                // attachments: req.body.attachments
            }
            transporter.sendMail(mailOptions, (error, info) =>{
                if(error){
                    res.send({data: false, token: tokenInfo.token});
                    res.end();
                }
                else{
                    console.log("Email enviado")
                    res.status(200)
                    res.send({data: true, token: tokenInfo.token});
                }
            });
            // console.log(req.body)
            // res.send({data: true, token: tokenInfo.token});
            // res.end();
            
        } else {
            res.send({
                auth: false
            })
            res.end()
        }

    } catch (error) {
        console.error(error);
        res.send({
            auth: false,
            error: error
        })
        res.end()
    }
})

//************************************ ENVIAR UN CORREO CON LOS PAGOS COMPLETADOS EN LA SEMANA */
router.get("/correoPagosCompletados",async(req, res) =>{
    let correos=[]
    // const usuarios= await querys.executeQuery("SELECT idUser, Usuario, UserName, IdRol, Mail FROM Finanzas.dbo.Users WHERE IdRol in (2) AND Status = 1", req);
   const usuarios= await querys.executeQuery("SELECT idUser, Usuario, UserName, IdRol, Mail FROM Finanzas.dbo.Users WHERE idUser in (1) AND Status = 1", req);
    usuarios.data.map((e)=>{
        correos.push(e.Mail)
    })

    // let pagosPendientes = []
    const pagos = await querys.executeQuery(`SELECT * FROM [Finanzas].[dbo].[vta_PagosCompletos] ORDER BY completeStatusDate ASC`, req);
   console.log(pagos)

  let pagosCompletados = ''
   pagos.data.forEach((e) =>{
    console.log(e)
    pagosCompletados +=  `<tr style="height: 25px;">
         <td  prewrap style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)" >${e.title}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${getDateString(e.startDate)}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${getDateString(e.endDate)}</td>
         <td align="center" style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.Priority}</td>
         <td align="center" style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.StatusName}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${e.notes}</td>
         <td style="border: 1px solid rgb(4, 2, 4); border-top: 1px solid rgb(4, 2, 4)">${getDateString(e.completeStatusDate)}</td>
     </tr>`
 })

//  let fecha = new Date()
//  console.log(getDateString(fecha))

    console.log("entro aqui en mail")
    try {
        const tokenInfo = crypterService.verifyJWK(req);
        if (tokenInfo.auth) {
            let transporter = nodemailer.createTransport({
                host: 'mail.ppf.com.hn',
                secure: true,
                secureConnection: false,
                auth:{
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL
                },
            });
            let mailOptions = {
                from: `"IPS Support" <${process.env.USER_MAIL}> `,
                to: correos,
                cc: 'ldiscua@ppf.com.hn,lmedina@ppf.com.hn',
                subject:"Programación de Pagos Completados",
                html: `
                <table style="width: 80%; border-collapse:colapso ;padding:5px">
                <thead>
                    <tr style="border:1px sólido #C0C0C0; height: 30px;">
                        <th wrap style="background:#F0F0F0; width: 20%">Titulo</th>
                        <th style="background:#F0F0F0; width: 15%">Fecha Inicio    </th>
                        <th style="background:#F0F0F0;width: 15%">Fecha Vencimiento</th>
                        <th style="background:#F0F0F0; width: 8%">Prioridad</th>
                        <th  style="background:#F0F0F0; width: 8%;">Estado</th>
                        <th style="background:#F0F0F0; width: 30%">Nota</th>
                        <th style="background:#F0F0F0; width: 30%">Fecha Completo</th>
                    </tr>
                </thead>
                <tbody >
                    ${pagosCompletados.toString()}
                </tbody>
                <!-- <tfoot>Fecha: </tfoot> -->
               
               
            </table>`,
                // attachments: req.body.attachments
            }
            transporter.sendMail(mailOptions, (error, info) =>{
                if(error){
                    res.send({data: false, token: tokenInfo.token});
                    res.end();
                }
                else{
                    console.log("Email enviado")
                    res.status(200)
                    res.send({data: true, token: tokenInfo.token});
                }
            });
            // console.log(req.body)
            // res.send({data: true, token: tokenInfo.token});
            // res.end();
            
        } else {
            res.send({
                auth: false
            })
            res.end()
        }

    } catch (error) {
        console.error(error);
        res.send({
            auth: false,
            error: error
        })
        res.end()
    }
})



module.exports = router;