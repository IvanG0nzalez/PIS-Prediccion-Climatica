require('dotenv').config()
const schedule = require('node-schedule');
const axios = require('axios');
const models = require('./models');
const historialC = require('./controls/HistorialClimaticoControl');
let historialControl = new historialC();
const prediccionC = require('./controls/PrediccionClimaticaControl');
let prediccionControl = new prediccionC();

const schedulePrediccion = process.env.SCHEDULE_PREDICCION === 'true';
const scheduleHistorial = process.env.SCHEDULE_HISTORIAL === 'true';

if(schedulePrediccion){
    const prediccion = schedule.scheduleJob('0 * * * *', async () => {
        try {
            await prediccionControl.calcularNuevaPrediccion("Automatica", "Temperatura", "Temperatura", 240);
            await prediccionControl.calcularNuevaPrediccion("Automatica", "Humedad", "Humedad", 240);
            await prediccionControl.calcularNuevaPrediccion("Automatica", "Atmosferica", "Atmosferica", 240);

            const horaActual = new Date().toLocaleString();
            console.log(`[${horaActual}] Se ejecutó el schedule de prediccion`);
        } catch (error) {
            const horaActual = new Date().toLocaleString();
            console.error(`[${horaActual}] Error en schedule prediccion`, error);
        }
    });
}

if(scheduleHistorial){
    const obtenerDatos = schedule.scheduleJob('*/2 * * * *', async () => {
        try {
            await historialControl.guardarAutomaticamente();

            const horaActual = new Date().toLocaleString();
            console.log(`[${horaActual}] Se ejecutó el schedule de historial`);
        } catch (error) {
            const horaActual = new Date().toLocaleString();
            console.error(`[${horaActual}] Error en schedule historial`, error);
        }
    });
}

const rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59);

async function keepServiceAlive() {
  try {
    const response = await axios.get('https://climatify.onrender.com/predicciones');
    console.log('Solicitud exitosa:', response.status);
  } catch (error) {
    console.error('Error al hacer la solicitud:', error.message);
  }
}

const job = schedule.scheduleJob(rule, keepServiceAlive);


