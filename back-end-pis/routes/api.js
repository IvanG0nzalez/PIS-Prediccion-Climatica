var express = require('express');
var router = express.Router();

const rol = require("../app/controls/RolControl");
let rolControl = new rol();

const usuario = require("../app/controls/UsuarioControl");
let usuarioControl = new usuario();

const cuenta = require("../app/controls/CuentaControl");
let cuentaControl = new cuenta();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//ROL
router.get("/admin/roles", rolControl.listar);
router.post("/admin/rol/guardar", rolControl.guardar);

//USUARIO
router.get("/admin/usuarios", usuarioControl.listar);
router.post("/admin/usuario/guardar", usuarioControl.crear);

//CUENTA
router.post("/admin/inicio_sesion", cuentaControl.inicio_sesion);
router.get("/admin/cuentas", cuentaControl.listar);
router.patch("/admin/cuenta/modificar/:external", cuentaControl.update)






module.exports = router;
