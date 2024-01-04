"use strict";

var models = require("../models");
var historial = models.historial_climatico;

var prediccion = models.prediccion_climatica;
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
            attributes: ["fecha", "external_id", "hora", "valor_medido"],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    //GUARDAR HISTORIAL
    async guardar(req, res) {
        if (
            req.body.hasOwnProperty("valor_medido") &&
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
                // Obtener la fecha y hora actuales
                var fechaHoraActual = new Date();
                var fechaActual = fechaHoraActual.toISOString().slice(0, 10);
                var horaActual =
                    fechaHoraActual.getHours() +
                    ":" +
                    fechaHoraActual.getMinutes() +
                    ":" +
                    fechaHoraActual.getSeconds();
    
                var data = {
                    fecha: fechaActual,
                    external_id: uuid.v4(),
                    hora: horaActual,
                    valor_medido: req.body.valor_medido,
                    id_sensor: sensorA.id,
                };
    
                var result = await historial.create(data);
                if (result === null) {
                    res.status(401).json({
                        msg: "Error",
                        tag: "No se puede crear",
                        code: 401,
                    });
                } else {
                    res.status(200).json({ msg: "OK", code: 200 });
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        }
    }
    

    //GENERAR REPORTE
    async generar_reporte(req, res) {
        if (req.body.hasOwnProperty("") &&
            req.body.hasOwnProperty("hora") &&
            req.body.hasOwnProperty("valor_medido") &&
            req.body.hasOwnProperty("sensor")) {
            var uuid = require("uuid");
            var sensorA = await sensor.findOne({
                where: { external_id: req.body.sensor },
            });

            var prediccionA = await prediccion.findOne({
                where: { external_id: req.body.sensor },
            });

            if (sensorA == undefined || sensorA == null) {
                res.status(401);
                res.json({ msg: "ERROR", tag: "El sensor a buscar no existe", code: 401, });
            } else {
                if (prediccionA == undefined || prediccionA == null) {
                    res.status(401);
                    res.json({ msg: "ERROR", tag: "La prediccion a buscar no existe", code: 401, });
                } else {
                    var data = {
                        fecha: req.body.fecha,
                        external_id: uuid.v4(),
                        hora: req.body.hora,
                        valor_medido: req.body.valor_medido,
                        id_sensor: sensorA.id,
                    };

                    var result = await historial.create(data);
                    if (result === null) {
                        res.status(401).json({ msg: "Error", tag: "No se puede crear", code: 401 });
                    } else {
                        res.status(200).json({ msg: "OK", code: 200 });
                    }
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        }
    }


}

module.exports = HistorialControl;
