"use strict";

var models = require("../models");
var historial = models.historial_climatico;
var prediccion = models.prediccion_climatica;
var sensor = models.sensor;
const historial_prediccion = historial.predicciones; 

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
        {
          model: models.sensor,
          as: "sensor",
          attributes: ["alias", "tipo_medicion", "external_id"],
        },
      ],
      attributes: ["fecha", "hora", "valor_medido", "external_id"],
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
      attributes: ["alias", "ip", "tipo_medicion", "external_id"],
      include: [
        {
          model: models.historial_climatico,
          as: "historial_climatico",
          attributes: ["fecha", "hora", "valor_medido", "external_id"],
          limit: 1,
          order: [
            ["fecha", "DESC"],
            ["hora", "DESC"],
          ],
        },
      ],
    });

    if (sensores_historial.length === 0) {
      res.status(200);
      res.json({ msg: "No hay sensores registrados", code: 200, datos: {} });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: sensores_historial });
    }
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
  async reporte(req, res) {
    try {
        // Obtén todos los historiales climáticos
        const historiales = await historial.findAll();

        // Si no se encuentran historiales, responde con un mensaje de error y un código de respuesta 404
        if (!historiales || historiales.length === 0) {
            return res.status(404).json({ msg: "No se encontraron historiales climáticos", code: 404, datos: {} });
        }

        // Obtén todas las predicciones asociadas a cada historial climático
        const lista_predicciones = await Promise.all(
            historiales.map(async (historial_c) => {
                // Utiliza la relación entre historial_climatico y prediccion_climatica
                const historial_predicciones = await historial_c.getPredicciones({
                    as: 'prediccion_climatica', // Asegúrate de usar el mismo nombre que has definido en la asociación
                    include: [{
                        model: prediccion,
                        attributes: ['fecha', 'hora', 'valor_calculado', 'tipo']
                    }]
                });
                return {
                    historial: historial_c,
                    predicciones: historial_predicciones
                };
            })
        );

        // Muestra en la consola la lista de historiales climáticos y predicciones obtenidas
        console.log("Lista de historiales y predicciones");
        console.log(lista_predicciones);

        // Responde con un código 200 y los datos obtenidos
        res.status(200).json({ msg: "OK", code: 200, datos: lista_predicciones });
    } catch (error) {
        // En caso de error, muestra un mensaje de error en la consola y responde con un código de respuesta 500
        console.error('Error al obtener el reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor', mensaje: error.message });
    }
}




  async generar_reporte(req, res) {
    if (
      req.body.hasOwnProperty("") &&
      req.body.hasOwnProperty("hora") &&
      req.body.hasOwnProperty("valor_medido") &&
      req.body.hasOwnProperty("sensor")
    ) {
      var uuid = require("uuid");
      var sensorA = await sensor.findOne({
        where: { external_id: req.body.sensor },
      });

      var prediccionA = await prediccion.findOne({
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
        if (prediccionA == undefined || prediccionA == null) {
          res.status(401);
          res.json({
            msg: "ERROR",
            tag: "La prediccion a buscar no existe",
            code: 401,
          });
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
            res
              .status(401)
              .json({ msg: "Error", tag: "No se puede crear", code: 401 });
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
