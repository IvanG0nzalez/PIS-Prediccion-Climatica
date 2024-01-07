"use strict";

const { Sequelize } = require('sequelize');
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

    async obtener_por_fecha(req, res) {
        const fecha = req.params.fecha;
        var lista = await historial.findAll({
            where: { fecha: fecha },
            include: [
                { model: models.sensor, as: "sensor", attributes: ['alias', 'tipo_medicion', 'external_id'] },
            ],
            attributes: ['fecha', 'hora', 'valor_medido', 'external_id']
        });
        if (lista === undefined || lista === null) {
            res.status(404);
            res.json({ msg: "Error", tag: "Lecturas no encontradas", code: 404 });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async obtener_historiales_actual(req, res) {

        var sensores_historial = await sensor.findAll({
            attributes: [['alias', 'nombre_sensor'], 'tipo_medicion', 'external_id'],
            include: [
                {
                    model: models.historial_climatico,
                    as: "historial_climatico",
                    attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
                    limit: 1,
                    order: [['fecha', 'DESC'], ['hora', 'DESC']]
                },
            ],
        });

        if (sensores_historial.length === 0) {
            res.status(200);
            res.json({ msg: "No hay sensores registrados", code: 200, datos: {} });
        } else {
            const resultadoSinId = sensores_historial.map(sensor => {
                const { id, ...resto } = sensor.get();
                return resto;
            });
            res.status(200)
            res.json({ msg: "OK", code: 200, datos: resultadoSinId });
        }
    }

    //GUARDAR HISTORIAL
    async guardarManual(req, res) {
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

    async guardarAutomaticamente() {
        recurso = ""; //Aquí poner la dirección del esp32
        var informacion = this.obtener_datos(recurso);
        var uuid = require("uuid");
        //console.log("aquí se va a guardar");

        var sensorTemp = await sensor.findOne({
            where: { alias: "Temperatura" },
        });
        var sensorHume = await sensor.findOne({
            where: { alias: "Humedad" },
        });
        /*
        var sensorAtmo = await sensor.findOne({
            where: { alias: "Atmosferica" },
        });*/
        var fechaHoraActual = new Date();
        var fechaActual = fechaHoraActual.toISOString().slice(0, 10);
        var horaActual =
            fechaHoraActual.getHours() +
            ":" +
            fechaHoraActual.getMinutes() +
            ":" +
            fechaHoraActual.getSeconds();

        var dataTemperatura = {
            fecha: fechaActual,
            external_id: uuid.v4(),
            hora: horaActual,
            valor_medido: informacion.Temperatura,
            id_sensor: sensorTemp.id,
        };

        var dataHumedad = {
            fecha: fechaActual,
            external_id: uuid.v4(),
            hora: horaActual,
            valor_medido: informacion.Humedad,
            id_sensor: sensorHume.id,
        };
        console.log(dataTemperatura);
        console.log(dataHumedad);
        /*
                if (sensorTemp == undefined || sensorTemp == null) {
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
        
                    var dataTemperatura = {
                        fecha: fechaActual,
                        external_id: uuid.v4(),
                        hora: horaActual,
                        valor_medido: informacion.Temperatura,
                        id_sensor: sensorTemp.id,
                    };
        
                    var dataHumedad = {
                        fecha: fechaActual,
                        external_id: uuid.v4(),
                        hora: horaActual,
                        valor_medido: informacion.Humedad,
                        id_sensor: sensorHume.id,
                    };
                    /*
                    var dataAtmosferica = {
                        fecha: fechaActual,
                        external_id: uuid.v4(),
                        hora: horaActual,
                        valor_medido: informacion.Atmosferica,
                        id_sensor: sensorAtmo.id,
                    };*/
        /*
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
    }*/
    }

    async obtener_datos(recurso) {
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        }
        const response = await fetch(recurso, {
            cache: 'no-store',
            method: "GET",
            headers: headers,
        });
        const responseData = await response.json();
        return responseData;
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