const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generarJWT");

const login = async (req, res = response) => {
  const { username, password } = req.body;

  try {
    //verificar si el email existe
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(400).json({
        msg: "El usuario y/o contraseña no son correctos -username",
      });
    }

    //si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario y/o contraseña no son correctos -usuario false",
      });
    }

    // vericar contraseña
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "El usuario y/o contraseña no son correctos -password",
      });
    }

    //generar el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
