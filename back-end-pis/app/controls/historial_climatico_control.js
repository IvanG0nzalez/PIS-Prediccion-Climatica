"use strict";

var models = require("../models");
var historial = models.historial_climatico;
var sensor = models.sensor;

class HistorialControl {

    //LISTAR HISTORIAL
    async listar(req, res) {
        var lista = await historial.findAll({
            include: [
                {
                    model: models.sensor,
                    as: "sensor",
                    attributes: ["external_id", "alias", "ip", "tipo_medicion"],
                },
            ],
            attributes: ["fecha", "external_id", "hora", "valor_medio"],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    //GUARDAR HISTORIAL
    async guardar(req, res) {
        if (
            req.body.hasOwnProperty("fecha") &&
            req.body.hasOwnProperty("hora") &&
            req.body.hasOwnProperty("valor_calculado") &&
            req.body.hasOwnProperty("sensor")
        ) {
            var uuid = require("uuid");

            var sensorA = await sensor.findOne({
                where: { external_id: req.body.sensor },
            });

            if (sensorA == undefined || sensorA == null) {
                res.status(401);
                res.json({
                    msg: "ERROR",
                    tag: "El sensor a buscar no existe",
                    code: 401,
                });
            } else {
                var data = {
                    fecha: req.body.fecha,
                    external_id: uuid.v4(),
                    hora: req.body.hora,
                    valor_calculado: req.body.valor_calculado,
                    sensor: req.body.sensor,
                };

                var result = await historial.create(data);
                if (result === null) {
                    res.status(401);
                    res.json({ msg: "Error", tag: "No se puede crear", code: 401 });
                } else {
                    res.status(200);
                    res.json({ msg: "OK", code: 200 });
                }
            }


        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        }
    }

}

module.exports = HistorialControl;