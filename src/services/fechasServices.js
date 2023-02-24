const express = require("express");
const router = express.Router();

const days = [
    {
        "day": 0,
        "codeEn": "sun",
        "en": "Sunday",
        "es": "Domingo",
        "codeEs": "Dom"
    },
    {
        "day": 1,
        "codeEn": "mon",
        "en": "Monday",
        "es": "Lunes",
        "codeEs": "Lun"
    },
    {
        "day": 2,
        "codeEn": "tue",
        "en": "Tuesday",
        "es": "Martes",
        "codeEs": "Mar"
    },
    {
        "day": 3,
        "codeEn": "wed",
        "en": "Wednesday",
        "es": "Miercoles",
        "codeEs": "Mie"
    },
    {
        "day": 4,
        "codeEn": "thu",
        "en": "Thursday",
        "es": "Jueves",
        "codeEs": "Jue"
    },
    {
        "day": 5,
        "codeEn": "fri",
        "en": "Friday",
        "es": "Viernes",
        "codeEs": "Vie"
 
    },
    {
        "day": 6,
        "codeEn": "sat",
        "en": "Saturday",
        "es": "Sabado",
        "codeEs": "Sab"
    }
 ]
 
const mounths = [
    {
        month: 0,
        en: 'January',
        codeEn: 'Jan',
        es: 'Enero',
        codeEs: 'Ene'
    },
    {
        month: 1,
        en: 'February',
        codeEn: 'Jan',
        es: 'Febrero',
        codeEs: 'Feb'
    },
    {
        month: 2,
        en: 'March',
        codeEn: 'Mar',
        es: 'Marzo',
        codeEs: 'Mar'
    },
    {
        month: 3,
        en: 'April',
        codeEn: 'Apr',
        es: 'Abril',
        codeEs: 'Abr'
    },
    {
        month: 4,
        en: 'May',
        codeEn: 'May',
        es: 'Mayo',
        codeEs: 'May'
    },
    {
        month: 5,
        en: 'June',
        codeEn: 'June',
        es: 'Junio',
        codeEs: 'Jun'
    },
    {
        month: 6,
        en: 'July',
        codeEn: 'July',
        es: 'Julio',
        codeEs: 'Jul'
    },
    {
        month: 7,
        en: 'August',
        codeEn: 'Aug',
        es: 'Agosto',
        codeEs: 'Ago'
    },
    {
        month: 8,
        en: 'September',
        codeEn: 'Sept',
        es: 'Septiembre',
        codeEs: 'Sep'
    },
    {
        month: 9,
        en: 'October',
        codeEn: 'Oct',
        es: 'Octubre',
        codeEs: 'Oct'
    },
    {
        month: 10,
        en: 'November',
        codeEn: 'Nov',
        es: 'Noviembre',
        codeEs: 'Nov'
    },
    {
        month: 11,
        en: 'December',
        codeEn: 'Dec',
        es: 'Diciembre',
        codeEs: 'Dic'
    },
 ]
 
const getDaysName = (date , language ) => {
    const fecha = new Date(date);
    const day = fecha.getDay();
    return language === 'en' ? days[day].en : days[day].es
 }
 
const getMonthNames = (month, language) => {
    return language === 'en' ? mounths[month].en : mounths[month].es
 }
const setDateTimeSQL = (date) => {
    const d = new Date(date.getTime());
    return d.toLocaleString('EN-US', { hour12: false }).replace(',', ' ');
    // return d.toLocaleDateString('EN-US', { hour12: false }).replace(',', '') + ' ' + d.toLocaleTimeString('EN-US').replace(',', '');
 }

 const getDateString = (date = new Date()) => {
    
    const fecha = new Date(date);
    const dayName = getDaysName(fecha, 'es');
    const dayNumber = fecha.getDate();
    const monthName = getMonthNames(fecha.getMonth(), 'es');
    const yearNumber = fecha.getFullYear();
    return `${dayName}, ${dayNumber} de ${monthName} de ${yearNumber}`;
  }

 module.exports = {
    setDateTimeSQL,
    getDateString
 };