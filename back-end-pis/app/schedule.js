const schedule = require('node-schedule');
const models = require('./models');
const historialC = require('./controls/HistorialClimaticoControl');
let historialControl = new historialC();
const prediccionC = require('./controls/PrediccionClimaticaControl');
let prediccionControl = new prediccionC();

const tarea = schedule.scheduleJob('*/30 * * * *', async () => {
    try {
        await prediccionControl.calcularNuevaPrediccion("Automatica");

        console.log('Tarea de cálculo de predicciones ejecutada.');
    } catch (error) {
        console.error('Error en una tarea', error);
    }
})

const obtenerDatos = schedule.scheduleJob('*/30 * * * *', async () => {
    try {
        await historialControl.guardarAutomaticamente();
    } catch (error) {
        console.error('Error en una tarea', error);
    }
});

