const Cliente = require("../models/cliente");
const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Material = require("../models/materiales");
const Cotizacion = require("../models/cotizaciones");

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

const existeUsuarioID = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe: ${id}`);
  }
};

const existeClienteID = async (id) => {
  const existeCliente = await Cliente.findById(id);
  if (!existeCliente) {
    throw new Error(`El id no existe: ${id}`);
  }
};

const existeMaterialID = async (id) => {
  const existeMaterial = await Material.findById(id);
  if (!existeMaterial) {
    throw new Error(`El id no existe: ${id}`);
  }
};

const existeCotizacionID = async (id) => {
  const existeCotizacion = await Cotizacion.findById(id);
  if (!existeCotizacion) {
    throw new Error(`El id no existe: ${id}`);
  }
};

module.exports = {
  esRolValido,
  usernameExiste,
  existeUsuarioID,
  existeClienteID,
  existeMaterialID,
  existeCotizacionID,
};
