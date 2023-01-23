const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const data = require('../../database/conection');
const crypterService = require('../../services/crypto');
const querys = require('../../services/querys');

router.post("/",(req, res) =>{
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
                // cc: req.body.cc,
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


module.exports = router;