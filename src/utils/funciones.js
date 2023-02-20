const cryptoJS = require('crypto-js');
const jwk = require('jsonwebtoken')
const data = require('../database/conection');


const obtenerUsuario = async (req) => {
    console.log("entro get calendario")
    let idUser = 0
    const tokenOld = req.headers['x-access-token'];
    if (!tokenOld) {
        return ('Es necesario el token')
    } else {
        jwk.verify(tokenOld, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // console.log('Token no valido', err)
                const res = {
                    auth: false,
                    message: 'Error al autenticar'
                }
                return res
            } else {
                idUser = decoded.idUser;
            }
        })
        console.log(idUser)
        return idUser
    }
}

module.exports = {
    obtenerUsuario
}
