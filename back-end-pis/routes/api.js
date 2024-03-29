var express = require('express');
var router = express.Router();
let jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");


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


//MIDDLEWARE
const auth = function middleware(req, res, next) {
  const token = req.headers["token"];

  console.log(req.headers);

  if (token === undefined) {
    res.status(401);
    res.json({
      msg: "ERROR",
      tag: "Falta token",
      code: 401,
    });
  } else {
    require("dotenv").config();
    const key = process.env.KEY;
    jwt.verify(token, key, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "Token no valido o expirado",
          code: 401,
        });
      } else {
        req.id = decoded.external;
        console.log("aquio");
        console.log(req.id);
        const models = require("../app/models");
        const cuenta = models.cuenta;
        const aux = await cuenta.findOne({
          where: { external_id: decoded.external },
        });
        if (aux === null) {
          res.status(401);
          res.json({
            msg: "ERROR",
            tag: "Token no valido",
            code: 401,
          });
        } else {
          next();
        }
      }
    });
  }
  // console.log(req.url);
  // console.log(token);
  // next();
};

const isSuperAdmin = async (req, res, next) => {
  const models = require("../app/models");
  const cuenta = models.cuenta;
  const cuentaAux = await cuenta.findOne({
    where: { external_id: req.id },
  });
  const usuario = models.usuario;
  const usuarioAux = await usuario.findOne({
    where: { id: cuentaAux.id_usuario },
  });
  const rol = models.rol;
  console.log("aqui ajdo")
  const rolAux = await rol.findOne({
    where: { id: usuarioAux.id_rol },
  });

  if ((rolAux.nombre = "Super-Administrador")) {
    next();
  } else {
    res.status(401);
    res.json({
      msg: "ERROR",
      tag: "Debe ser un Super Administrador",
      code: 401,
    });
  }

  // console.log(req.url);
  // console.log(token);
  // next();
};


const isAdmin = async (req, res, next) => {
  const models = require("../app/models");
  const cuenta = models.cuenta;
  const cuentaAux = await cuenta.findOne({
    where: { external_id: req.id },
  });
  const usuario = models.usuario;
  const usuarioAux = await usuario.findOne({
    where: { id: cuentaAux.id_usuario },
  });
  const rol = models.rol;
  const rolAux = await rol.findOne({
    where: { id: usuarioAux.id_rol },
  });

  if ((rolAux.nombre = "Administrador")) {
    next();
  } else {
    res.status(401);
    res.json({
      msg: "ERROR",
      tag: "Debe ser un Super Admin",
      code: 401,
    });
  }

  // console.log(req.url);
  // console.log(token);
  // next();
};


//api historiales climaticos 
router.get("/admin/historiales", [auth], historialControl.listar);
router.post("/admin/historiales/guardar", [auth], historialControl.guardarManual);
router.get('/admin/historiales/obtener/:fecha', [auth], historialControl.obtener_por_fecha);
router.get('/historiales/obtener_actuales', historialControl.obtener_historiales_actual);
router.get("/historiales_hoy", historialControl.listar_hoy);


//api sensores
router.get('/admin/sensores', [auth], sensorControl.listar);
router.post('/admin/sensores/guardar', [auth], sensorControl.validarSensor, sensorControl.guardar);
router.get('/admin/sensores/obtener/:external', [auth], sensorControl.obtener_sensor);
router.patch('/admin/sensores/modificar/:external', [auth], sensorControl.modificar);
router.get('/admin/sensores/obtener/historial_climatico/:external', [auth], sensorControl.obtener_historial_climatico);



//api predicciones climaticas
router.get('/predicciones', async (req, res) =>{ await prediccionControl.obtener_proximas_4(req, res)});


//api roles
router.get("/admin/roles",[auth, isSuperAdmin], rolControl.listar);
router.post("/admin/roles/guardar",[auth, isSuperAdmin],rolControl.validarRol, rolControl.guardar);

//api usuarios
router.get("/admin/usuarios",[auth, isSuperAdmin], usuarioControl.listar);
router.get("/admin/usuarios/obtener/:external", [auth, isSuperAdmin], usuarioControl.obtener);
router.post("/admin/usuarios/guardar", [auth, isSuperAdmin],usuarioControl.validarUsuario ,usuarioControl.guardar);
router.patch("/admin/usuarios/modificar/:external", [auth, isSuperAdmin], usuarioControl.modificar);

//api cuentas
router.post("/inicio_sesion",cuentaControl.validarInicio_Sesion, cuentaControl.inicio_sesion);
router.post("/admin/cuentas/clave/:external", [auth], cuentaControl.cambiar_clave);
router.patch("/admin/cuentas/estado/:external",[auth, isSuperAdmin],  cuentaControl.actualizar_estado)

//api reportes
router.get("/reporte", prediccionControl.reporte);
//router.get("/admin/clima", prediccionControl.weather);

module.exports = router;