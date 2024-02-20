"use strict";

const { check, validationResult } = require("express-validator");
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

    async listar_hoy(req, res) {
        const fechaActual = new Date().toISOString().slice(0, 10);
        var lista = await historial.findAll({
            where: { fecha: fechaActual},
            include: [
                {
                    model: models.sensor,
                    as: "sensor",
                    attributes: ["external_id", "alias", "ip", "tipo_medicion"],
                },
            ],
            attributes: ["fecha", "external_id", "hora", "valor_medido"],
        });

        console.log(lista.length);

        if(lista.length === 0) {
            res.status(404).json({ msg: "No hay registros para hoy", code: 404 });
        } else {
            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        }
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

    
    async validarGuardar(req, res, next){
        await check("sensor").notEmpty().withMessage("Debe ingresar un sensor").run(req);
    
        const errors = validationResult(req).formatWith(({ msg, value }) => ({ msg, value }));
        //console.log(errors.formatWith(msg, value))
      
        if (!errors.isEmpty()) {
          return res.status(400).json({
            msg: "ERROR",
            tag: "Credenciales Invalidas",
            code: 401,
            errors: errors.array(),
          });
        }
      
        next();
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
        let transaction;
        try {
            const sensorAux = await sensor.findOne({
                where: { alias: "Atmosferica" },
                attributes: ['ip'],
            });

            if (!sensorAux) {
                throw new Error('No se encontró el sensor de presión atmosférica');
            }

            const ip = sensorAux.ip;
            const recurso = `http://${ip}/`; //Aquí poner la dirección del esp32
            console.log("recurso", recurso);
            const informacion = await this.obtener_datos(recurso);
            
            if (!informacion || informacion.Temperatura === undefined || informacion.Humedad === undefined || informacion.Atmosferica === undefined) {
                throw new Error('Faltan datos de los sensores, no se guardaron los historiales');
            }

            console.log(informacion);

            const uuid = require("uuid");
            transaction = await models.sequelize.transaction();

            const sensorTemp = await sensor.findOne({
                where: { alias: "Temperatura" },
                transaction
            });
            const sensorHume = await sensor.findOne({
                where: { alias: "Humedad" },
                transaction
            });

            const sensorAtmo = await sensor.findOne({
                where: { alias: "Atmosferica" },
                transaction
            });

            const fechaHoraActual = new Date();
            const fechaActual = fechaHoraActual.toLocaleDateString('en-GB');
            const fechaActualFormateada = fechaActual.split('/').reverse().join('-');
            const horaActual = fechaHoraActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit'});

            const dataTemperatura = {
                fecha: fechaActualFormateada,
                external_id: uuid.v4(),
                hora: horaActual,
                valor_medido: informacion.Temperatura,
                id_sensor: sensorTemp.id,
            };

            const dataHumedad = {
                fecha: fechaActualFormateada,
                external_id: uuid.v4(),
                hora: horaActual,
                valor_medido: informacion.Humedad,
                id_sensor: sensorHume.id,
            };

            const dataAtmosferica = {
                fecha: fechaActualFormateada,
                external_id: uuid.v4(),
                hora: horaActual,
                valor_medido: informacion.Atmosferica,
                id_sensor: sensorAtmo.id,
            }

            console.log(dataTemperatura);
            console.log(dataHumedad);
            console.log(dataAtmosferica);
            
            const resultTemperatura = await historial.create(dataTemperatura, { transaction });
            const resultHumedad = await historial.create(dataHumedad, { transaction });
            const resultAtmosferica = await historial.create(dataAtmosferica, { transaction });
            
            await transaction.commit();

            if (!resultTemperatura || !resultHumedad || !resultAtmosferica) {
                throw new Error('No se guardaron todos los historiales climáticos');
            } else {
                console.log("Se guardaron todos los historiales climáticos");
            }
            
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw new Error('Error guardando los historiales climáticos automáticamente: ' + error.message);
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