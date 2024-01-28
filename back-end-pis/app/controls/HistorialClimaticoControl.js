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
        var recurso = "http://192.168.1.113/"; //Aquí poner la dirección del esp32
        var informacion = await this.obtener_datos(recurso);
        if (informacion && informacion.Temperatura !== undefined &&
            informacion.Humedad !== undefined &&
            informacion.Presion !== undefined) {
            console.log(informacion);
            var uuid = require("uuid");
            //console.log("aquí se va a guardar");

            var sensorTemp = await sensor.findOne({
                where: { alias: "Temperatura" },
            });
            var sensorHume = await sensor.findOne({
                where: { alias: "Humedad" },
            });

            var sensorAtmo = await sensor.findOne({
                where: { alias: "Atmosferica" },
            });
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

            var dataAtmosferica = {
                fecha: fechaActual,
                external_id: uuid.v4(),
                hora: horaActual,
                valor_medido: informacion.Presion,
                id_sensor: sensorAtmo.id,
            }
            console.log(dataTemperatura);
            console.log(dataHumedad);
            console.log(dataAtmosferica);

            var resultTemperatura = await historial.create(dataTemperatura);
            var resultHumedad = await historial.create(dataHumedad);
            var resultAtmosferica = await historial.create(datdataAtmosfericaa);
            if (resultTemperatura === null && resultHumedad === null && resultAtmosferica === null) {
                res.status(401).json({
                    msg: "Error",
                    tag: "No se puede crear",
                    code: 401,
                });
            } else {
                res.status(200).json({ msg: "OK", code: 200 });
            }

        } else {
            res.status(500);
            res.json({ msg: "ERROR", tag: "Error del servidor esp32", code: 500 });
        }

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



}

module.exports = HistorialControl;