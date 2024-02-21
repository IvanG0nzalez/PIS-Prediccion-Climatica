"use strict";

module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define('usuario',{
        nombres: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        apellidos: {type: DataTypes.STRING(150), defaultValue:"NONE"},
        cedula: {type: DataTypes.STRING(10), defaultValue:"NONE"},
        external_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    }, { timestamps: false, freezeTableName: true });
        usuario.associate = function(models){
        usuario.hasOne(models.cuenta, {foreignKey: 'id_usuario', as: 'cuenta'});
        usuario.belongsTo(models.rol, {foreignKey: 'id_rol'});
        usuario.hasMany(models.usuario_sensor, {foreignKey: 'id_usuario', as: 'usuario_sensor'});
    };
    return usuario;
};