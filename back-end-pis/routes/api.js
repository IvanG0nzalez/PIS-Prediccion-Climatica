var express = require('express');
var router = express.Router();
const sensorC = require('../app/controls/SensorControl');
let sensorControl = new sensorC();

const prediccionC = require('../app/controls/PrediccionClimaticaControl');
let prediccionControl = new prediccionC();

const historialC = require("../app/controls/HistorialClimaticoControl");
let historialControl = new historialC();


const rol = require("../app/controls/RolControl");
let rolControl = new rol();

const usuario = require("../app/controls/UsuarioControl");
let usuarioControl = new usuario();

const cuenta = require("../app/controls/CuentaControl");
let cuentaControl = new cuenta();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//api historial climatico 
router.get("/admin/historiales", historialControl.listar);
router.post("/admin/historiales/guardar", historialControl.guardar);
router.post("/admin/historiales/reporte/generar", historialControl.generar_reporte);
router.get('/admin/historiales/obtener/:fecha', historialControl.obtener_por_fecha);
router.get('/admin/historiales/obtener_actuales', historialControl.obtener_historiales_actual);

//api sensores
router.get('/admin/sensores', sensorControl.listar);
router.post('/admin/sensores/guardar', sensorControl.guardar);
router.get('/admin/sensores/obtener/:external', sensorControl.obtener_sensor);
router.patch('/admin/sensores/modificar/:external', sensorControl.modificar);
router.get('/admin/sensores/obtener/historial_climatico/:external', sensorControl.obtener_historial_climatico);



//api prediccion climatica
router.get('/predicciones', prediccionControl.obtener_proximas_4);


//ROL
router.get("/admin/roles", rolControl.listar);
router.post("/admin/roles/guardar", rolControl.guardar);

//USUARIO
router.get("/admin/usuarios", usuarioControl.listar);
router.post("/admin/usuarios/guardar", usuarioControl.guardar);
router.patch('/admin/usuarios/modificar/:external', usuarioControl.modificar);

//CUENTA
router.post("/admin/inicio_sesion", cuentaControl.inicio_sesion);
router.get("/admin/cuentas", cuentaControl.listar);
router.patch("/admin/cuentas/modificar/:external", cuentaControl.actualizar_estado)






module.exports = router;
