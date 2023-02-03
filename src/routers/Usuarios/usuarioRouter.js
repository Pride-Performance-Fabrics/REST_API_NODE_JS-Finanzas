const express = require("express");
const router = express.Router();
const data = require("../../database/conection");
const querys = require("../../services/querys");
const crypterService = require("../../services/crypto");
const jwk = require("jsonwebtoken");

const cryptoJS = require('crypto-js');



// *** Obtener la lista de todos los usuarios ***
router.get("/", async (req, res) => {
  querys.executeQuery(
    // `SELECT * FROM Finanzas.dbo.Users`,
    `SELECT U.idUser, U.idPersonal, U.Usuario, U.UserName, U.Mail, 
        R.IdRol, R.Rol, S.IdStatus, S.StatusCategory, S.StatusName
        from Finanzas.dbo.Users as U
        INNER JOIN dbo.Roles R on R.IdRol = U.IdRol
        INNER JOIN dbo.Status S on S.IdStatus = U.Status`,
    req,
    res
  );
  // console.log(res)
})

// *** OPTIENE UN NUEVO TOKEN ***
router.get("/getNewToken/", (req, res) => {
  const tokenInfo = crypterService.verifyJWK(req);
  if (tokenInfo.auth) {
    res.send({ token: tokenInfo.token });
    res.end();
  } else {
    res.send({
      auth: false,
    });
    res.end();
  }
});

// *** VERIFICA SI EXISTE UN USUARIO *** 
router.get("/up", async (req, res) => {
  querys.executeQuery(
    `select * from Finanzas.dbo.Users where idPersonal = '${req.body.idPersonal}'`,
    req,
    res
  );
});

// *** VERIFICA EL USUARIO Y LA CONTRASENIA PARA INICIAR SESION *** 

router.post("/login", async (req, res) => {
  console.log('*****************************************************************')

  // var encrypted = cryptoJS.AES.encrypt("Hola","finazas2023").toString()

  // console.log(`Encriptacion`,encrypted)

  var decrypted = cryptoJS.AES.decrypt(req.body.Password, "finazas2023").toString(cryptoJS.enc.Utf8)

  // console.log(`Desencriptacion`, decrypted)

  console.log(req.body)
  // TODO ENCRIPTAR PASSWORK
  try {
    const endpoint = !req.body.subscription
      ? null
      : req.body.subscription.endpoint;
    const p256dh = !req.body.subscription
      ? null
      : req.body.subscription.keys.p256dh;
    const auth = !req.body.subscription
      ? null
      : req.body.subscription.keys.auth;

    const pool = await data.connectToDatabase();
    const result = await pool
      .request()
      // .input("Password", decrypted)
      .input("Usuario", req.body.Usuario)
      .input("IP", req.body.IP ?? '')
      .execute("web.loginFinanzas")
      .then(async (result) => {
        console.log(result)
        const user = await result.recordset[0];
        //   console.log({...user, endpoint, p256dh, auth})
        if (result.recordset.length > 0) {

          var Passworddecrypted = cryptoJS.AES.decrypt(result.recordset[0].PasswordN, "finazas2023").toString(cryptoJS.enc.Utf8)
          // console.log("Passsworddecryted",Passworddecrypted)

          if (Passworddecrypted === decrypted) {
            console.log("entro aqui")
            await crypterService.setToken(
              {
                ...user,
                subscription: !req.body.subscription
                  ? null
                  : req.body.subscription,
              },
              res
            );
          }else{
            console.log("No existe coincidencia")
            console.log({ auth: false })
            res.send({ auth: false });
          }

        } else {
          console.log({ auth: false })
          res.send({ auth: false });
        }
        console.log((new Date()).toLocaleString(), user)
        console.log('*****************************************************************')
      })
      .catch((error) => {
        console.log({ error })
        res.send({
          auth: false,
          error: error,
        });
        res.end();
      });

    res.end();
  } catch (error) {
    console.error(error);
    res.send({
      auth: false,
      error: error,
    });
    res.end();
  }
});


// *** CREAR UN NUEVO USUARIO *** 

router.post("/", async (req, res) => {
  var PasswordDecrypted = cryptoJS.AES.decrypt(req.body.Password, "finazas2023").toString(cryptoJS.enc.Utf8);

  console.log(PasswordDecrypted)
  querys.executeQuery(
    `INSERT INTO Finanzas.dbo.Users (
                          idPersonal,
                          Usuario, 
                          UserName,
                          PasswordN, 
                          Password, 
                          Mail, 
                          Status, 
                          IdRol
                          ) VALUES (
                          '${req.body.idPersonal}',
                          '${req.body.Usuario}', 
                          '${req.body.UserName}',
                          '${req.body.PasswordN}', 
                          '${PasswordDecrypted}', 
                          '${req.body.Mail}', 
                          ${req.body.Status}, 
                          ${req.body.IdRol}
                          ) SELECT TOP(1) * FROM Finanzas.dbo.Users ORDER BY idUser DESC`,
    req,
    res
  );
});


// *** VERIFICA SI EL USUARIO ESTA AUTENTICADO *** 
router.get("/userIsAuth", (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.send("Es necesario el token");
    } else {
      jwk.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({
            auth: false,
            message: "Error al autenticar",
            error: err,
          });
        } else {
          res.json(decoded);
        }
        res.end();
      });
    }
  } catch (error) {
    console.log("Error UserIsAuth", { error });
    res.send({
      auth: false,
      error: error,
    });
    res.end();
  }
});

// *** MODIFICAR UN USUARIO *** 
router.put("/", async (req, res) => {
  querys.executeQuery(
    `UPDATE Finanzas.dbo.Users 
      SET idPersonal = '${req.body.idPersonal}',
      Usuario = '${req.body.Usuario}', 
      UserName = '${req.body.UserName}',
      Mail = '${req.body.Mail}', 
      Status = ${req.body.Status}, 
      IdRol = '${req.body.IdRol}' 
      Where idUser = '${req.body.idUser}'`,
    req,
    res
  );
});

// *** MODIFICAR CONTRASENIA DE UN USUARIO *** 
router.put("/password", async (req, res) => {
  querys.executeQuery(
    `UPDATE Finanzas.dbo.Users 
                        SET password = '${req.body.Password}'
                        Where idUser = '${req.body.idUser}'`,
    req,
    res
  );
});

// *** OBTENER TODOS LOS dbo.User con su ID, UserName, Usuario *** 
router.get("/seleccionUsuarios/", async (req, res) => {
  querys.executeQuery(
    "SELECT idUser, Usuario, UserName, Mail, IdRol from Finanzas.dbo.Users where Status = 1",
    req,
    res
  );
});


module.exports = router;