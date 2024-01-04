const schedule = require('node-schedule');
const models = require('./models');

const MetodoPredictivo = require('./Metodo_Predictivo');
let metodo_predic = new MetodoPredictivo();

const tarea = schedule.scheduleJob('0 0 * * *', async () => {
    try {
        await metodo_predic.calcularNuevaPrediccion("Automatica");

        console.log('Tarea de cálculo de predicciones ejecutada.');
    } catch (error) {
        console.error('Error en una tarea', error);
    }
})

