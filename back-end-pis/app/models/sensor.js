"use strict";

module.exports = (sequelize, DataTypes) => {
    const sensor = sequelize.define('sensor', {
        alias: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        ip: { type: DataTypes.STRING(50), defaultValue: "NONE" },
        tipo_medicion: { type: DataTypes.ENUM('Temperatur', 'Humedad', 'Viento') },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    sensor.associate = function (models) {
        sensor.hasMany(models.historial_climatico, {foreignKey: 'id_sensor', as: 'historial_climatico'});
        sensor.hasMany(models.prediccion_climatica, {foreignKey: 'id_sensor', as: 'prediccion_climatica'});
        sensor.hasMany(models.usuario_sensor, {foreignKey: 'id_sensor', as: 'usuario_sensor'});
    };
    return sensor;
};