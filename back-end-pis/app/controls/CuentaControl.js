"use strict";

var models = require("../models");
const bcrypt = require("bcrypt");

var rol = models.rol;
var usuario = models.usuario;
var cuenta = models.cuenta;
let jwt = require("jsonwebtoken");
/*
instalar
npm install jsonwebtoken --save
npm install doteenv --save
*/

class CuentaControl {
  async listar(req, res) {
    var lista = await cuenta.findAll({
      attributes: ["nombre_usuario", "clave", "estado", "external_id"],
    });
    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      data: lista,
    });
  }

  async update(req, res) {
    const external_usuario = req.params.external;

    var usuarioAux = await usuario.findOne({
      where: {
        external_id: external_usuario,
      }
    });
    var cuentaAux=await cuenta.findOne({
        where: {
            id_usuario: usuarioAux.id
        }
    })
    if (req.body.hasOwnProperty("estado")) {

        cuentaAux.estado = req.body.estado;
        await cuentaAux.save();


    } else {
        res.status(200);
        res.json({
          msg: "ERROR",
            tag: "Ingrese el estado de la cuenta",
          code: 400
        });    
    }

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      data: cuentaAux,
    });
  }

  async inicio_sesion(req, res) {
    if (
      req.body.hasOwnProperty("nombre_usuario") &&
      req.body.hasOwnProperty("clave")
    ) {
      console.log("entraaaaaaa");
      let cuentaA = await cuenta.findOne({
        where: {
          nombre_usuario: req.body.nombre_usuario,
        },
        include: [
          {
            model: models.usuario,
            as: "usuario",
            attributes: ["apellidos", "nombres", "external_id"],
          },
        ],
      });
      if (cuentaA === null) {
        res.status(400);
        res.json({
          msg: "ERROR",
          tag: "cuenta no existe",
          code: 400,
        });
      } else {
        if (cuentaA.estado == true) {
          const validar = await bcrypt.compare(req.body.clave, cuentaA.clave);
          console.log(validar);

          if (validar) {
            const token_data = {
              external: cuentaA.external_id,
              check: true,
            };
            require("dotenv").config();
            const key = process.env.KEY;
            const token = jwt.sign(token_data, key, {
              expiresIn: "2h",
            });
            var info = {
              token: token,
              user: cuentaA.usuario.apellidos + " " + cuentaA.usuario.nombres,
              external_id: cuentaA.usuario.external_id,
            };
            res.status(200);
            res.json({
              msg: "OK",
              tag: "Listi",
              code: 200,
              info: info,
            });
          } else {
            res.status(400);
            res.json({
              msg: "ERROR",
              tag: "clave incorrecta",
              code: 400,
            });
          }
        } else {
          res.status(400);
          res.json({
            msg: "ERROR",
            tag: "cuuenta desactivada",
            code: 400,
          });
        }
      }
    } else {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "falta dara",
        code: 400,
      });
    }
  }
}

module.exports = CuentaControl;
