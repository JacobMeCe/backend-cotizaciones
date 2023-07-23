const { response } = require("express");

const Cliente = require("../models/cliente");

const clientesGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, cliente] = await Promise.all([
    Cliente.countDocuments(query),
    Cliente.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    cliente,
  });
};

const clientesPost = async (req, res = response) => {
  const { nombre, domicilio, celular, email } = req.body;
  const cliente = new Cliente({ nombre, domicilio, celular, email });

  await cliente.save();

  res.json({
    cliente,
  });
};

const clientesPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, nombre, domicilio, celular, ...resto } = req.body;

  const cliente = await Usuario.findByIdAndUpdate(id, resto);

  res.json(cliente);
};

const clientesDelete = async (req, res = response) => {
  const { id } = req.params;
  const cliente = await Cliente.findByIdAndUpdate(id, { estado: false });

  res.json(cliente);
};

module.exports = {
  clientesGet,
  clientesPut,
  clientesPost,
  clientesDelete,
};
