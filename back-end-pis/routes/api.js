var express = require('express');
var router = express.Router();
const sensorC = require('../app/controls/SensorControl');
let sensorControl = new sensorC();

const historialC = require("../app/controls/historial_climatico_control");
let historialControl = new historialC();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//HISTORIAL 
router.get("/admin/historial", historialControl.listar);
router.post("/admin/historial/guardar", historialControl.guardar_historial);
router.post("/admin/historial/reporte/generar", historialControl.generar_reporte);


//api sensores
router.get('/admin/sensores', sensorControl.listar);
router.post('/admin/sensores/guardar', sensorControl.guardar);
router.get('/admin/sensores/obtener/:external', sensorControl.obtener_sensor);
router.patch('/admin/sensores/modificar/:external', sensorControl.modificar);
router.get('/admin/sensores/obtener/historial_climatico/:external', sensorControl.obtener_historial_climatico);
router.get('/admin/sensores/obtener/prediccion_climatica/:external', sensorControl.obtener_prediccion_climatica);
module.exports = router;
