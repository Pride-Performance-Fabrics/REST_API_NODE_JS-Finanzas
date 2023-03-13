let admin = require("firebase-admin");
let messaging = require('firebase-admin/messaging');
let serviceAccount = require("./serviceAccountKey.json");
const querys = require('../../services/querys');

const {setDateTimeSQL} = require('../fechasServices')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const enviarNotificacion = async(req) =>{

    try {
        const {usuarios, title, body, data, UserSend = null, priority ='high', Tipo} = req.body

        usuarios.forEach(async (user) => {
            guardarNotificacion(user, title, body, data, Tipo, req, usuarios);
        });

        const tokens = await getNotificacionesToken(usuarios, req);
        console.log(tokens)

        const message = {
            data: {
                ...data, priority:"high", Tipo: Tipo + ""
            },
            notification: {
                title: title,
                body: body,
            },
            priority: "high",
            tokens: tokens

        };

        messaging.getMessaging().sendMulticast(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return message
            // response.responses.map(x => console.log(x));
        })
        .catch((error) => {
            console.error('Error sending message:', data, error);
        });

    } catch (error) {
        console.error('ERROR: ENVIAR NOTIFICACION', req.body, (new Date()).toLocaleDateString(), (new Date()).toLocaleTimeString())
    }
}


const getNotificacionesToken = async (usuarios, req) => {
    const result = await querys.executeQuery(`SELECT idUser, NotificacionToken FROM Finanzas.dbo.Sessions WHERE idUser in (${usuarios.toString()}) AND NotificacionToken IS NOT NULL ORDER BY IdSession DESC`, req);
    return result.data.map(x => x.NotificacionToken)
}

// const getUserNotificacionesToken = async (usuarios, req) => {
//     const result = await querys.executeQuery(`SELECT * FROM Finanzas.dbo.Sessions WHERE idUser in (${usuarios.toString()}) AND NotificacionToken IS NOT NULL ORDER BY IdSession DESC`, req);
//     return result.data.map(x => x.NotificacionToken)
// }


const guardarNotificacion = async (user, Title, Body, Data, Tipo, req, usuarios) => {
    if (user !== 0) {
    
    usuarios.forEach(u => {
        console.log(u)
    });
        const query = `
    INSERT INTO Finanzas.dbo.Notificaciones (IdUser, Fecha , Title, Body, Data,  Tipo, UserSend) 
    VALUES (${user}, '${setDateTimeSQL(new Date)}'  , '${Title}', '${Body}', '${JSON.stringify(Data)}', ${Tipo}, '${usuarios}')`;
    console.log({query})
        const result = await querys.executeQuery(query, req);
        // console.log(query);
    }
}


module.exports = { enviarNotificacion };
