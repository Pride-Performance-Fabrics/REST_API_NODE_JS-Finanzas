const express = require('express');
const data = require('../database/conection');
const crypterService = require('../services/crypto');

const executeQuery = async(query, req, res = null) => {
    console.log('***************************************************')
    console.log(query, (new Date()).toLocaleTimeString())
    try {
        let respuesta = {};
        const tokenInfo = crypterService.verifyJWK(req);
        if (tokenInfo.auth) {
            const pool = await data.connectToDatabase();
            const result = await pool.request().query(query)
            .then(result => {
                // console.log(req.body)
                // console.log(result.recordset)
                    if(res !== null){
                        res.status(200).send({ data: result.recordset, token: tokenInfo.token });
                        res.end();
                    }else{
                        respuesta = { data: result.recordset, token: tokenInfo.token };
                    }
                })
                .catch(error => {
                    console.error({error, token: tokenInfo.token, query, Fecha: new Date()})
                    if(res !== null){
                    res.send({ 'error': error,  });
                    res.end();
                    }else{
                        respuesta = { 'error': error };
                    }
                });
            } else {
            console.error({auth: false, token: tokenInfo.token, query, Fecha: new Date()})
            if(res !== null){
            res.send({
                auth: false
            })
            res.end()
            }else{
                respuesta = { auth: false };
            }
        }
        return respuesta;
    } catch (error) {
        console.error({error, query, Fecha: new Date()});
        if(res !== null){
        res.send({
            auth: false,
            error: error
        })
        res.end()
        }else{
            return { auth: false, error: error };
        }
    }
}


module.exports = {
    executeQuery
};