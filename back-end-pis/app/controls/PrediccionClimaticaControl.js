"use strict";

var models = require("../models");
var prediccion = models.prediccion_climatica;
var sensor = models.sensor;
const axios = require("axios");
const Sequelize = require('sequelize');
const { spawn } = require('child_process');

class PrediccionClimaticaControl {

  async obtener_proximas_4(req, res) {
    var prediccionesTemperatura = await this.obtenerPredicciones("Temperatura");
    var prediccionesHumedad = await this.obtenerPredicciones("Humedad");
    var prediccionesAtmosferica = await this.obtenerPredicciones("Atmosferica");

    var data = {
      temperatura: prediccionesTemperatura,
      humedad: prediccionesHumedad,
      atmosferica: prediccionesAtmosferica
    }

    if (!prediccionesTemperatura || !prediccionesHumedad || !prediccionesAtmosferica) {
      res.status(404);
      res.json({ msg: "Error", tag: "Lecturas no encontradas", code: 404 });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: data });
    }
  }

  async obtenerPredicciones(tipo_medicion) {
    var predicciones = await prediccion.findAll({
      where: { tipo_medicion: tipo_medicion },
      attributes: [
        "fecha", 
        [models.sequelize.literal("DATE_FORMAT(hora, '%h %p')"), "hora"], 
        "valor_calculado", 
        "valor_real", 
        "tipo_medicion", 
        "external_id"
      ],
      limit: 4,
      order: [
        ["fecha", "ASC"],
        [models.sequelize.literal("TIME(hora)"), "ASC"],
      ],
    });

    return predicciones;
  }

  async calcularNuevaPrediccion(tipo, tipo_medicion, sensorAlias, num_registros) {
    var uuid = require("uuid");
    const sensor = await models.sensor.findOne({ where: { alias: sensorAlias } });

    const historiales = await models.historial_climatico.findAll({
      where: { id_sensor: sensor.id },
      attributes: ['id', 'valor_medido', 'fecha', 'hora'],
      order: [['id', 'DESC']],
      limit: num_registros
    });

    const valores = historiales.map(historial => historial.valor_medido).reverse();
    const fechas = historiales.map(historial => `${historial.fecha} ${historial.hora}`).reverse();

    const city = "Loja";
    const apiKey = "a1a6bbf10a0d4b1289a25246240701";
    const APIUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const dataU = await axios.get(APIUrl);
    const valorReal = dataU.data.current.temp_c
    if (!valorReal) {
      return res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }

    const childPython = spawn('python', ['./app/controls/metodo_predictivo.py', valores, fechas, Math.floor(num_registros / 2)]);
    let prediccionPy = '';

    childPython.stdout.on('data', (data) => {
      prediccionPy += data.toString();
      console.log("prediccion", prediccionPy);
    });

    childPython.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    childPython.on('close', (code) => {
      console.log(`Se salió del script de pyhton con código de salida ${code}`);
      
      const prediccionJson = JSON.parse(prediccionPy);

      prediccionJson.forEach(async (element) => {
        const fechaHora = element[0];
        const valor = element[1];
        const valorCalculado = parseFloat(valor).toFixed(2);
        const [fecha, hora] = fechaHora.split(' ');

        const nuevaPrediccion = await prediccion.create({
          fecha: fecha,
          hora: hora,
          valor_calculado: valorCalculado,
          valor_real: valorReal,
          tipo: tipo,
          tipo_medicion: tipo_medicion,
          external_id: uuid.v4()
        });

        for (const historial of historiales) {
          await historial.addPredicciones(nuevaPrediccion);
        }

      });
    });
  }

  async reporte(req, res) {
    var lista = await prediccion.findAll({
      attributes: ["tipo_medicion", "fecha", "hora", "valor_calculado", "valor_real",
        [Sequelize.literal('ABS(`prediccion_climatica`.`valor_calculado` - `prediccion_climatica`.`valor_real`)'), 'error']
      ],
      order: [['fecha', 'DESC'], ['hora', 'DESC']],
    });
    if (lista === undefined || lista === null) {
      res.status(500);
      res.json({ msg: "OK", code: 500, datos: {} });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: lista });
    }
  }
  //DATA REAL}


  // async weather(req, res) {
  //   const city = "Loja";
  //     const apiKey = "a1a6bbf10a0d4b1289a25246240701";
  //     const APIUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  //     const dataU = await axios.get(APIUrl);
  //     const valorReal = dataU.data.current.temp_c
  //     console.log(valorReal)
  //   let weather=dataU.data;
  //   let error = null;
  //   try {
  //     //console.log(response)
  //     //weather = response.data;
  //     console.log(weather.current.temp_c)
  //     res.status(200).json({ msg: "OK", code: 200, datos: weather });
  //   } catch (error) {
  //     weather = null;
  //     error = "Error al obtener Datos";
  //     res.status(500).json({ msg: "500", code: 500, datos: {} });
  //   }
  // }
}

module.exports = PrediccionClimaticaControl;
