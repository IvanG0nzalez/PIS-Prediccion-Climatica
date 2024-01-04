'use strict';
var models = require('./models');


class Metodo_Predictivo {
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
            const resultadoCalculo = this.metodo_numerico(valoresMedidos);
            //console.log("resultadoCalculo", resultadoCalculo);

            const nuevaPrediccion = await models.prediccion_climatica.create({
                fecha: new Date(),
                hora: new Date(),
                valor_calculado: resultadoCalculo,
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

    metodo_numerico(arrayDeValores) {
        if (!Array.isArray(arrayDeValores)) {
            throw new Error('Se esperaba un array de valores.');
        }

        if (arrayDeValores.length === 0) {
            throw new Error('El array de valores está vacío.');
        }

        const resultadoSuma = arrayDeValores.reduce((acumulador, valor) => acumulador + valor, 0);
        //console.log("resultado suma",resultadoSuma);
        return resultadoSuma;
    }
}

module.exports = Metodo_Predictivo;