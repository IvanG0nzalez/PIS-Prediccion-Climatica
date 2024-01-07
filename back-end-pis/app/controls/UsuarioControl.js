"use strict";
const bcrypt = require("bcrypt");

var models = require("../models");
var usuario = models.usuario;
var rol = models.rol;
var cuenta = models.cuenta;

class UsuarioControl {
  async listar(req, res) {
    var lista = await usuario.findAll({
      attributes: ["nombres", "apellidos", "cedula", "external_id", "id_rol"],
      include: [
        {
          model: rol,
          as: "rol",
          attributes: ["external_id", "nombre"],
        },
        {
          model: models.cuenta,
          as: "cuenta",
          attributes: ["nombre_usuario", "estado"],
        },
      ],
    });

    if (lista === undefined || lista === null) {
      res.status(200);
      res.json({
        msg: "No hay usuarios registrados",
        code: 200,
        data: {},
      });
    } else {
      res.status(200);
      res.json({
        msg: "OK",
        code: 200,
        data: lista,
      });
    }
  }

  async obtener(req, res) {
    const external = req.params.external;
    if (external) {
      var lista = await usuario.findOne({
        where: { external_id: external },
        attributes: ["nombres", "apellidos", "cedula", "external_id", "id_rol"],
        include: [
          {
            model: rol,
            as: "rol",
            attributes: ["external_id", "nombre"],
          },
          {
            model: models.cuenta,
            as: "cuenta",
            attributes: ["nombre_usuario", "estado"],
          },
        ],
      });
      if (lista === undefined || lista === null) {
        res.status(400);
        res.json({
          msg: "Error",
          tag: "No se encontro el usuario",
          code: 400,
          data: [],
        });
      } else {
        res.status(200);
        res.json({
          msg: "OK",
          code: 200,
          data: lista,
        });
      }
    } else {
      res.status(400);
      res.json({
        msg: "Error",
        tag: "External Invalido",
        code: 400,
        data: [],
      });
    }
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
          const claveCifrada = await bcrypt.hash(req.body.clave, 10);
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
    const claveCifrada = await bcrypt.hash(req.body.clave, 10);

    var lista = await usuario.findOne({
      where: { external_id: external },
    });
    if (lista === null) {
      var cuentaAux = await cuenta.findOne({
        where: { id_usuario: lista.id },
      });
      if (cuentaAux === null) {
        lista.nombres = req.body.nombres;
        lista.apellidos = req.body.apellidos;
        lista.cedula = req.body.direccion;
        cuentaAux.estado = req.body.estado;
        cuentaAux.clave = claveCifrada;
        await lista.save();
        await cuentaAux.save();

        res.status(200);
        res.json({
          msg: "OK",
          tag: "La información se actualizo",
          code: 200,
          data: lista,
        });
      } else {
      }
    } else {
      res.status(203);
      res.json({
        msg: "ERROR",
        tag: "NO se encuentra el Usuario",
        code: 401,
        error_msg: error,
      });
    }
  }
}

module.exports = UsuarioControl;
