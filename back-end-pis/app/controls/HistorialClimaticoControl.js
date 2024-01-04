"use strict";

var models = require("../models");
var historial = models.historial_climatico;
var sensor = models.sensor;

class HistorialClimaticoControl {
  async listar(req, res) {
    var lista = await historial.findAll({
      include: [
        {
          model: models.sensor,
          as: "sensor",
          attribute: ["external_id", "alias", "ip", "tipo_medicion"],
        },
      ],
      attributes: ["fecha", "external_id", "hora", "valor_medio"],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }
}

module.exports = HistorialClimaticoControl;
