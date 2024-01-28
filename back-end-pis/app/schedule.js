require('dotenv').config()
const schedule = require('node-schedule');
const models = require('./models');
const historialC = require('./controls/HistorialClimaticoControl');
let historialControl = new historialC();
const prediccionC = require('./controls/PrediccionClimaticaControl');
let prediccionControl = new prediccionC();

const schedulePrediccion = process.env.SCHEDULE_PREDICCION === 'true';
const scheduleHistorial = process.env.SCHEDULE_HISTORIAL === 'true';

if(schedulePrediccion){
    const prediccion = schedule.scheduleJob('*/30 * * * *', async () => {
        try {
            await prediccionControl.calcularNuevaPrediccion("Automatica");
            console.log('Se ejecutó el schedule de prediccion');
        } catch (error) {
            console.error('Error en schedule prediccion', error);
        }
    })
}

if(scheduleHistorial){
    const obtenerDatos = schedule.scheduleJob('*/20 * * * *', async () => {
        try {
            await historialControl.guardarAutomaticamente();
            console.log('Se ejecutó el schedule de historial');

        } catch (error) {
            console.error('Error en schedule historial', error);
        }
    });
}


