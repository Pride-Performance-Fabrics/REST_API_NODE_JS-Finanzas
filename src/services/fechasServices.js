const express = require("express");
const router = express.Router();

const setDateTimeSQL = (date) => {
    const d = new Date(date);
    return d.toLocaleString('EN-US', { hour12: false }).replace(',', '');
    // return d.toLocaleDateString('EN-US', { hour12: false }).replace(',', '') + ' ' + d.toLocaleTimeString('EN-US').replace(',', '');
 }

 module.exports = setDateTimeSQL;