"use strict";

module.exports = (sequelize, DataTypes) => {
    const usuario_sensor = sequelize.define('usuario_sensor', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    usuario_sensor.associate = function (models) {
        usuario_sensor.belongsTo(models.usuario, {foreignKey: 'id_usuario'});
        usuario_sensor.belongsTo(models.sensor, {foreignKey: 'id_sensor'});
    };
    return usuario_sensor;
};