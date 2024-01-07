"use strict";

var models = require("../models");
var prediccion = models.prediccion_climatica;
var sensor = models.sensor;
const { SimpleLinearRegression } = require('ml-regression');
const { exec } = require('child_process');

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

  async obtener_proximas_4(req, res) {
    var lista = await prediccion.findAll({
      attributes: ['fecha', 'hora', 'valor_calculado', 'tipo', 'external_id'],
      limit: 1, 
      order: [['fecha', 'DESC'], ['hora', 'DESC']],
    });
    if (lista === undefined || lista === null) {
      res.status(404);
      res.json({ msg: "Error", tag: "Lectura no encontrada", code: 404 });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: lista });
    }
  }

  async calcularNuevaPrediccion(tipo) {
    try {

      var uuid = require('uuid');

      const historialesClimaticos = await models.historial_climatico.findAll({
        attributes: ['valor_medido', 'id'],
        include: [
          {
            model: models.sensor,
            as: 'sensor',
            attributes: [],
          },
        ],
      });
      console.log("historialesClimaticos", historialesClimaticos);

      const valoresMedidos = historialesClimaticos.map((historial) => historial.valor_medido);
      const resultadoCalculo = await this.metodo_numerico(valoresMedidos);
      console.log("resultadoCalculo", resultadoCalculo);

      //Aqui poner el valor real de la prediccion
      

      const nuevaPrediccion = await models.prediccion_climatica.create({
        fecha: new Date(),
        hora: new Date(),
        valor_calculado: resultadoCalculo,
        //valor_real: ,
        tipo: tipo,
        external_id: uuid.v4()
      });
      console.log(nuevaPrediccion);

      for (const historial of historialesClimaticos) {
        await historial.addPredicciones(nuevaPrediccion);
      }

      console.log('Predicción climática creada:', nuevaPrediccion);
    } catch (error) {
      console.error('Error al calcular la predicción climática:', error);
    }

  }

  async metodo_numerico(arrayDeValores) {

    if (!Array.isArray(arrayDeValores) || arrayDeValores.length === 0) {
      throw new Error('El array está vacío.');
    }

    const indices = Array.from({ length: arrayDeValores.length }, (_, i) => i);
    const valores = arrayDeValores;

    console.log("Indices:", indices);
    console.log("Valores:", valores);

    try {
        const regression = new SimpleLinearRegression(indices, valores);

        const predicciones = valores.map((valor) => regression.predict(valor));
        console.log("predicciones", predicciones);

        const sumaPredicciones = predicciones.reduce((acumulador, valor) => acumulador + valor, 0);
        const promedioPredicciones = (sumaPredicciones / predicciones.length);

        return Math.abs(promedioPredicciones);
    } catch (error) {
        console.error("Error en regresión lineal:", error);
        throw error;
    }

    //const resultadoSuma = arrayDeValores.reduce((acumulador, valor) => acumulador + valor, 0);
    //return resultadoSuma;
  }
}

module.exports = PrediccionClimaticaControl;


