"use strict";
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
var models = require("../models");
var usuario = models.usuario;
var rol = models.rol;
var cuenta = models.cuenta;

class UsuarioControl {
  async listar(req, res) {
    var lista = await usuario.findAll({
      attributes: ["nombres", "apellidos", "cedula", "external_id"],
      include: [
        {
          model: rol,
          as: "rol",
          attributes: ["external_id", "nombre"],
        },
        {
          model: models.cuenta,
          as: "cuenta",
          attributes: ["nombre_usuario", "estado", "external_id"],
        },
      ],
    });

    if (lista === undefined || lista === null) {
      res.status(204);
      res.json({
        msg: "No hay usuarios registrados",
        code: 200,
        datos: {},
      });
    } else {
      res.status(200);
      res.json({
        msg: "OK",
        code: 200,
        datos: lista,
      });
    }
  }

  async obtener(req, res) {
    const external = req.params.external;
    if (external) {
      var lista = await usuario.findOne({
        where: { external_id: external },
        attributes: ["nombres", "apellidos", "cedula", "external_id"],
        include: [
          {
            model: rol,
            as: "rol",
            attributes: ["external_id", "nombre"],
          },
          {
            model: models.cuenta,
            as: "cuenta",
            attributes: ["nombre_usuario", "estado", "external_id"],
          },
        ],
      });
      if (lista === undefined || lista === null) {
        res.status(204);
        res.json({
          msg: "Error",
          tag: "No se encontro el usuario",
          code: 400,
          datos: [],
        });
      } else {
        res.status(200);
        res.json({
          msg: "OK",
          code: 200,
          datos: lista,
        });
      }
    } else {
      res.status(400);
      res.json({
        msg: "Error",
        tag: "External Invalido",
        code: 400,
      });
    }
  }

  async validarUsuario(req, res, next) {
    await check("nombres").matches(/^[a-zA-Z ]+$/).withMessage("El campo de Nombres es erroneo").run(req);
    await check("apellidos").matches(/^[a-zA-Z ]+$/).withMessage("El campo de Apellidos es erroneo").run(req);
    await check("cedula").matches(/^\d{10}$/).withMessage("La cédula debe tener 10 dígitos numéricos").run(req);
    await check("nombre_usuario").notEmpty().withMessage("El usuario no debe estar vacio").run(req);
    await check("clave").notEmpty().withMessage("La clave no puede estar vacio").run(req);

    const errors = validationResult(req).formatWith(({ msg, value }) => ({ msg, value }));
    //console.log(errors.formatWith(msg, value))
  
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: "ERROR",
        tag: "Credenciales Invalidas",
        code: 401,
        errors: errors.array(),
      });
    }
  
    next();
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
              code: 400,
            });
          } else {
            res.status(200);
            res.json({
              msg: "OK",
              code: 200,
            });
          }
        } else {
          res.status(400);
          res.json({
            msg: "ERROR",
            tag: "No se encuentra Rol",
            code: 400,
          });
        }
      } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(409);
        res.json({
          msg: "ERROR",
          tag: "La cuenta ya existe en el sistema",
          code: 409,
          error_msg: error,
        });
      }
    }
  }

  async modificar(req, res) {
    const external = req.params.external;
    const {nombres, apellidos, nombre_usuario, clave} = req.body;

    var usuarioAux = await usuario.findOne({
      where: { external_id: external },
      include: [
        {
          model: models.cuenta,
          as: "cuenta",
          attributes: ["nombre_usuario", "estado", "clave"],
        },
      ],
    });

    if(usuarioAux === null || usuarioAux === undefined) {
      return res.status(404).json({ msg: "ERROR", tag: "No se encuentra el Usuario", code: 404 });
    } else {

      usuarioAux.nombres = nombres || usuarioAux.nombres;
      usuarioAux.apellidos = apellidos || usuarioAux.apellidos;
      await usuarioAux.save();

      if(nombre_usuario || clave) {
        const claveCifrada = await bcrypt.hash(clave, 10);
        usuarioAux.cuenta.clave = claveCifrada || usuarioAux.cuenta.clave;
        usuarioAux.cuenta.nombre_usuario = nombre_usuario || usuarioAux.cuenta.nombre_usuario;
        await usuarioAux.cuenta.save();
      }
      return res.status(200).json({ msg:"OK", tag: "Información actualizada correctamente", code: 200 })
    }
  }
}

module.exports = UsuarioControl;
