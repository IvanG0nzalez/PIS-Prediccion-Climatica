"use strict";

module.exports = (sequelize, DataTypes) => {
    const prediccion_climatica = sequelize.define('prediccion_climatica', {
        fecha: { type: DataTypes.DATEONLY, allowNull: false },
        hora: { type: DataTypes.TIME, allowNull: false },
        valor_calculado: { type: DataTypes.FLOAT.UNSIGNED, defaultValue: 0 },
        valor_real: { type: DataTypes.FLOAT.UNSIGNED, defaultValue: 0 },
        tipo: { type: DataTypes.ENUM('Automatica', 'Manual') },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    prediccion_climatica.associate = function (models) {
        prediccion_climatica.belongsToMany(models.historial_climatico, {
            through: 'historial_prediccion',
            foreignKey: 'id_prediccion_climatica', 
            otherKey: 'id_historial_climatico',
            as: 'historiales'
        });

    };
    return prediccion_climatica;
};