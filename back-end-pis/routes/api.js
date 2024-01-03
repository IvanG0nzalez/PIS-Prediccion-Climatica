var express = require('express');
var router = express.Router();

const historialC = require("../app/controls/historial_climatico_control");
let historialControl = new historialC();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//HISTORIAL 
router.get("/admin/historial", historialControl.listar);
router.post("/admin/historial/save", historialControl.guardar);


module.exports = router;
