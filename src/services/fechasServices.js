const express = require("express");
const router = express.Router();

const setDateTimeSQL = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('EN-US').replace(',', '') + ' ' + d.toLocaleTimeString('EN-US').replace(',', '');
 }

 module.exports = setDateTimeSQL;