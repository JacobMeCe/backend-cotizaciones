const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
  }
};

const usernameExiste = async (username = "") => {
  const usernameExiste = await Usuario.findOne({ username });
  if (usernameExiste) {
    throw new Error(`El usuario: ${username} ya a sido registrado`);
  }
};

const existeUsuarioID = async ( id ) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe: ${id}`);
  }
};

module.exports = {
  esRolValido,
  usernameExiste,
  existeUsuarioID,
};
