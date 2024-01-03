"use strict";

module.exports = (sequelize, DataTypes) => {
    const prediccion_climatica = sequelize.define('prediccion_climatica', {
        fecha: { type: DataTypes.DATEONLY, allowNull: false },
        hora: { type: DataTypes.TIME, allowNull: false },
        valor_calculado: { type: DataTypes.FLOAT.UNSIGNED, defaultValue: 0 },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    prediccion_climatica.associate = function (models) {
        prediccion_climatica.belongsTo(models.sensor, { foreignKey: 'id_sensor' });
    };
    return prediccion_climatica;
};