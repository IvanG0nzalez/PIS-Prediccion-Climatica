'use strict';
var models = require('../models');
var sensor = models.sensor;
var historial = models.historial_climatico;
const { check, validationResult } = require('express-validator');


class SensorControl {

    async listar(req, res) {
        var lista = await sensor.findAll({
            attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtener_sensor(req, res) {
        const external = req.params.external;
        var lista = await sensor.findOne({
            where: { external_id: external },
            attributes: ['alias', 'ip', 'tipo_medicion', 'external_id']
        });
        if (lista === undefined || lista == null) {
            res.status(404);
            res.json({ msg: "No existe ese sensor", code: 404, datos: {} });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }

    }

    async obtener_historial_climatico(req, res) {
        const external = req.params.external;
        var sensors = await sensor.findOne({
            where: { external_id: external },
            attributes: ['id']
        });
        if (sensors == undefined || sensors == null) {
            res.status(404);
            res.json({ msg: "No existe ese sensor", code: 404 });
        } else {
            var lista = await historial.findAll({
                where: { id_sensor: sensors.id },
                attributes: ['fecha', 'hora', 'valor_medido', 'external_id']
            })
            if (lista == undefined || lista == null) {
                res.status(200);
                res.json({ msg: "Este sensor no tiene historiales registrados", code: 200, datos: {} });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: lista });
            }
        }
    }

    async validarSensor(req, res, next) {
        await check('alias').notEmpty().withMessage('El alias no puede estar vacío').run(req);
        await check('ip').isIP().withMessage('La IP no es válida').run(req);
        await check('tipo_medicion').isIn(['Temperatura', 'Humedad', 'Atmosferica']).withMessage('Tipo de medición inválido').run(req);

        const errors = validationResult(req).formatWith(({ msg, value }) => ({ msg, value }));

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('alias') &&
            req.body.hasOwnProperty('ip') &&
            req.body.hasOwnProperty('tipo_medicion')) {
            var uuid = require('uuid');
            var data = {
                alias: req.body.alias,
                ip: req.body.ip,
                tipo_medicion: req.body.tipo_medicion,
                external_id: uuid.v4()
            }
            var result = await sensor.create(data);
            if (result === null) {
                return res.status(401).json({ msg: "Error", tag: "No se creó el sensor", code: 401 });
            } else {
                return res.status(200).json({ msg: "OK", code: 200 });
            }

        } else {
            return res.status(400).json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }

    async modificar(req, res) {
        const external = req.params.external;
        var sensores = await sensor.findOne({ where: { external_id: external } });

        var tipo_medicion = req.body.tipo_medicion;
        if (tipo_medicion && tipo_medicion != "Temperatura" && tipo_medicion != "Humedad" && tipo_medicion != "Atmosferica") {
            return res.status(400).json({ msg: "Error", code: 400, tag: "Los tipos disponibles son Temperatura, Humedad y Atmosferica" });
        }

        if (!sensores) {
            return res.status(404).json({ msg: "No existe ese sensor", code: 404, datos: {} });
        }

        try {
            const data = {
                alias: req.body.alias !== undefined ? req.body.alias : sensores.alias,
                ip: req.body.ip !== undefined ? req.body.ip : sensores.ip,
                tipo_medicion: req.body.tipo_medicion !== undefined ? req.body.tipo_medicion : sensores.tipo_medicion,
            };
            await sensores.update(data);
            res.status(200).json({ msg: "Sensor modificado", code: 200 });
        } catch (error) {
            res.status(500).json({ msg: "Error interno del servidor", code: 500, error_msg: error.message });
        }


    }
}
module.exports = SensorControl; //Exportar la clase