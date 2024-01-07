const schedule = require('node-schedule');
const models = require('./models');

const prediccionC = require('./controls/PrediccionClimaticaControl');
let prediccionControl = new prediccionC();

const tarea = schedule.scheduleJob('*/30 * * * *', async () => {
    try {
        //await prediccionControl.calcularNuevaPrediccion("Automatica");

        console.log('Se ejecutó el schedule de prediccion');
    } catch (error) {
        console.error('Error en schedule', error);
    }
})

