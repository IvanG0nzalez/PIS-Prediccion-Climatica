"use strict";
const bcrypt = require("bcrypt");

var models = require("../models");
var usuario = models.usuario;
var rol = models.rol;

class UsuarioControl {
  async listar(req, res) {
    var lista = await usuario.findAll({
      attributes: [
        "nombres",
        "apellidos",
        "cedula",
        "external_id",
        "id_rol",
      ],
    });
    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      data: lista,
    });
  }

  async guardar(req, res) {
    var UUID = require("uuid");
    var rolId = await rol.findOne({
      where: { external_id: req.body.id_rol },
    });

    // Lista de campos permitidos
    const camposPermitidos = [
      "nombres",
      "apellidos",
      "cedula",
      "nombre_usuario",
      "clave",
      "id_rol",
    ];

    // Verificar que solo se envíen campos permitidos
    const camposEnviados = Object.keys(req.body);
    const camposInvalidos = camposEnviados.filter(
      (campo) => !camposPermitidos.includes(campo)
    );

    if (
      camposInvalidos.length > 0 ||
      !camposPermitidos.every((campo) => camposEnviados.includes(campo))
    ) {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "Campos no permitidos o incompletos",
        code: 400,
      });
      return;
    } else {
      console.log(rolId);
      let transaction = await models.sequelize.transaction();
      try {
        if (rolId !== undefined && rolId !== null) {
          console.log(rolId.external_id);
          const claveCifrada= await bcrypt.hash(req.body.clave,10)
          var result = await usuario.create(
            {
              nombres: req.body.nombres,
              apellidos: req.body.apellidos,
              cedula: req.body.cedula,
              cuenta: {
                nombre_usuario: req.body.nombre_usuario,
                clave: claveCifrada,
              },
              id_rol: rolId.id,
              external_id: UUID.v4(),
            },
            {
              include: [
                {
                  model: models.cuenta,
                  as: "cuenta",
                },
              ],
              transaction,
            }
          );
          await transaction.commit();
          if (result === null) {
            res.status(401);
            res.json({
              msg: "ERROR",
              tag: "NO se pudo crear",
              code: 401,
            });
          } else {
            rolId.external_id = UUID.v4();
            await rolId.save();
            res.status(200);
            res.json({
              msg: "OK",
              code: 200,
              data: result,
            });
          }
        } else {
          res.status(401);
          res.json({
            msg: "ERROR",
            tag: "No se encuentra Rol",
            code: 401,
          });
        }
      } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(203);
        res.json({
          msg: "ERROR",
          tag: "la cuenta ya existe",
          code: 401,
          error_msg: error,
        });
      }
    }
  }

  async modificar(req, res) {
    const external = req.params.external;
    var rolId = await rol.findOne({
      where: { id: req.body.id_rol },
    });
    var lista = await usuario.findOne({
      where: { external_id: external },
      /* attributes: [
        "nombres",
        "apellidos",
        "cedula",
//        "id_rol",
        ],
      */
    });

    lista.nombres = req.body.nombres;
    lista.apellidos = req.body.apellidos;
    lista.cedula = req.body.direccion;
    lista.id_rol = rolId.id;

    await lista.save();
    rolId.external_id = UUID.v4();
    await rolId.save();

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      data: lista,
    });
  }
}
module.exports = UsuarioControl;
