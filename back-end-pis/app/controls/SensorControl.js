'use strict';
var models = require('../models');
var sensor = models.sensor;
var historial = models.historial_climatico;

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
            res.status(200);
            res.json({ msg: "No existe ese sensor", code: 200, datos: {} });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }

    }

    async obtener_historial_climatico(req, res){
        const external = req.params.external;
        var sensors = await sensor.findOne({
            where: { external_id: external },
            attributes: ['id']
        });
        if (sensors == undefined || sensors == null) {
            res.status(404);
            res.json({ msg: "No existe ese sensor", code: 404});
        }else{
            var lista = await historial.findAll({
                where: { id_sensor: sensors.id },
                attributes:['fecha','hora','valor_medido','external_id']
            })
            if(lista == undefined || lista == null){
                res.status(200);
                res.json({ msg: "Este sensor no tiene historiales registrados", code: 200, datos: {} });
            }else{
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: lista });
            }
        } 
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
                res.status(401);
                res.json({ msg: "Error", tag: "No se creó el sensor", code: 401 });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200 });
            }

        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }
    
    async modificar(req, res) {
        const external = req.params.external;
        var sensors = await sensor.findOne({where: { external_id: external }});

        if (sensors == undefined || sensors == null) {
            res.status(200);
            res.json({ msg: "No existe ese sensor", code: 200, datos: {} });
        } else {
            try {
                var uuid = require('uuid');
                const data = {
                    alias: req.body.alias !== undefined ? req.body.alias : sensors.alias,
                    ip: req.body.ip !== undefined ? req.body.ip : sensors.ip,
                    tipo_medicion: req.body.tipo_medicion !== undefined ? req.body.tipo_medicion : sensors.tipo_medicion,
                    external_id: uuid.v4()
                };
                await sensors.update(data);
                res.status(200).json({ msg: "Sensor modificado", code: 200 });
            } catch (error) {
                res.status(500).json({ msg: "Error interno del servidor", code: 500, error_msg: error.message });
            }
        }

    }
}
module.exports = SensorControl; //Exportar la clase