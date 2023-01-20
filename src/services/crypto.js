const cryptoJS = require('crypto-js');
const jwk = require('jsonwebtoken')
const data = require('../database/conection');
// const webpush = require('web-push');

const tiempoActivo = 20;
const tiempoRenovacion = 15;

// webpush.setVapidDetails('mailto:lmedina@ppf.com.hn', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)


const encrypt = (text) => {
    // TODO CAMBIAR createCipher por otro
    const encrypted = cryptoJS.AES.encrypt(text, process.env.CRYPTO_PASS).toString();
    return encrypted;
}

const decrypt = (text) => {
    const decrypted = cryptoJS.AES.decrypt(text, process.env.CRYPTO_PASS).toString();
    return decrypted;
}

const verifyJWK = (req) => {
    // console.log(req.headers);
    const tokenOld = req.headers['x-access-token'];
    if (!tokenOld) {
        return ('Es necesario el token')
    } else {
        // console.log(tokenOld)
        return jwk.verify(tokenOld, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // console.log('Token no valido', err)
                const res = {
                    auth: false,
                    message: 'Error al autenticar'
                }
                return res
            } else {
                // console.log('******** TOKEN VALIDO **************')
                const ahora = new Date();
                const expire = new Date(decoded.expire)
                // console.log((expire.getTime() - (tiempoRenovacion * 60 * 1000) )/1000 , ahora.getTime() /1000);
                if ((expire.getTime() - (tiempoRenovacion * 60 * 1000)) <= ahora.getTime()) {
                    const tokenNew = getToken(decoded.idUser, decoded.Usuario, decoded.UserName, decoded.IdRol, decoded.Rol, decoded.IP, decoded.ingreso, decoded.subscription);
                    setToken(decoded);
                    return ({
                        auth: true,
                        idUser: decoded.idUser,
                        Usuario: decoded.Usuario,
                        IdRol: decoded.IdRol,
                        Rol: decoded.Rol,
                        expire: decoded.expire,
                        ingreso: decoded.ingreso,
                        IP: decoded.IP,
                        subscription: decoded.subscription,
                        token: tokenNew
                    });

                } else {
                    return ({
                        auth: true,
                        idUser: decoded.idUser,
                        Usuario: decoded.Usuario,
                        IdRol: decoded.IdRol,
                        Rol: decoded.Rol,
                        expire: decoded.expire,
                        ingreso: decoded.ingreso,
                        IP: decoded.IP,
                        subscription: decoded.subscription,
                        token: tokenOld
                    });
                }

            }
        })
    }
}

const newToken = (req) => {
    const datos = verifyJWK(req);
    return jwk.sign({ idUser: decoded.idUser, Usuario: decoded.Usuario, IdRol: decoded.IdRol, Rol: decoded.Rol, IP: decoded.IP }, process.env.JWT_SECRET, { expiresIn: '5m' });
}

const getToken = (idUser, Usuario, UserName, IdRol, Rol, IP, subscription, ingreso = new Date(),) => {
    const date = new Date();
    const expire = new Date(date.getTime() + tiempoActivo * 60 * 1000);
    const token = jwk.sign({ idUser, Usuario, UserName, IdRol, Rol, expire, IP, ingreso, subscription }, process.env.JWT_SECRET, { expiresIn: '20m' });
    return token;
}



const setToken = async (user, res = false) => {
    console.log(user);
    if (user.idUser) {
        let date = new Date();
        let expire = new Date(date.getTime() + tiempoActivo * 60 * 1000);
        date = date.toLocaleString("en-US",{hour12: false}).replace(',', '');
        expire = expire.toLocaleString("en-US",{hour12: false}).replace(',', '');

       

        // console.log(`www`,date, expire)
        const po = await data.connectToDatabase();
        if (res) {
            // CREA UNA NUEVA SESION
            console.log(`bsssss,`, user);
            const token = getToken(user.idUser, user.Usuario, user.UserName, user.IdRol, user.Rol, user.IP, user.subscription);
            // console.log(token);
            const rest = await po.request()
                .input('idUser', user.idUser)
                .input('Token', token)
                .input('creada', date)
                .input('vencimiento', expire)
                .input('IP', user.IP)
                .input('Type', 'WEB')
                .execute('web.cambiarTokenSession')
                // console.log(`sdssssssss`,rest)
                .then((result) => {
                    res.send({
                        auth: true,
                        token: token,
                        user: user,
                    });
                    res.end();
                })
                .catch(error => {
                    console.error('line 126', { error })
                    res.send({
                        auth: false,
                        error: error
                    });
                    res.end();
                });

        } else {
            // ACTUALIZA EL TOKEN DE UNA SESION ACTIVA
            const token = getToken(user.idUser, user.Usuario, user.UserName, user.IdRol, user.Rol, user.IP, user.subscription, user.ingreso);
            console.log('******************************************************************************************************')
            console.log(JSON.stringify(user, null, 3));
            console.log('******************************************************************************************************')
            let creada = new Date(user.ingreso);
            creada = creada.toLocaleString("en-US").replace(',', '');
            const rest = await po.request()
                .input('idUser', user.idUser)
                .input('Token', token)
                .input('creada', creada)
                .input('vencimiento', expire)
                .input('IP', user.IP)
                .execute('web.cambiarTokenSession')
                .then((result) => {
                    return ({
                        auth: true,
                        token: token,
                        user: user,
                    });
                    res.end();
                })
                .catch(error => {
                    return ({
                        auth: false,
                        error: error
                    });
                    res.end();
                });
        }

    }
}



module.exports = {
    encrypt,
    decrypt,
    verifyJWK,
    getToken,
    setToken,
    
}