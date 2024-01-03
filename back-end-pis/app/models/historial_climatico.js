"use strict";

module.exports = (sequelize, DataTypes) => {
    const historial_climatico = sequelize.define('historial_climatico', {
        fecha: { type: DataTypes.DATEONLY, allowNull: false },
        hora: { type: DataTypes.TIME, allowNull: false },
        valor_medido: { type: DataTypes.FLOAT.UNSIGNED, defaultValue: 0 },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    historial_climatico.associate = function (models) {
        historial_climatico.belongsTo(models.sensor, { foreignKey: 'id_sensor' });
    };
    return historial_climatico;
};