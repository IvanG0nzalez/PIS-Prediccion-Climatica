"use strict";

var models = require("../models");
var prediccion = models.prediccion_climatica;
var sensor = models.sensor;

const MetodoPredictivo = require('../Metodo_Predictivo');
let metodo_predic = new MetodoPredictivo();

class PrediccionClimaticaControl {
  async listar(req, res) {
    var lista = await prediccion.findAll({
      include: [
        {
          model: models.sensor,
          as: "sensor",
          attribute: ["external_id", "alias", "ip", "tipo_medicion"],
        },
      ],
      attributes: ["fecha", "external_id", "hora", "valor_calculado"],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async guardar(req, res) {
    await metodo_predic.calcularNuevaPrediccion("Manual");
    res.status(200);
    res.json({ msg: "OK", code: 200});
  }
}

module.exports = PrediccionClimaticaControl;