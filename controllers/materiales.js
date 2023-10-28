const { response } = require("express");

const Materiales = require("../models/materiales");

const materialesGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, materiales] = await Promise.all([
    Materiales.countDocuments(query),
    Materiales.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    materiales,
  });
};

const materialGetById = async (req, res = response) => {
  const { id } = req.params;
  const material = await Materiales.findById(id);
  if (!material) {
    return res.status(404).json({
      msg: "Material no encontrado",
    });
  }
  res.json(material);
};

const materialesPost = async (req, res = response) => {
  const { nombre, peso, medida, precio } = req.body;
  const materiales = new Materiales({ nombre, peso, medida, precio });
  await materiales.save();
  res.json({
    materiales,
  });
};

const materialesPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  const material = await Materiales.findByIdAndUpdate(id, data, { new: true });
  if (!material) {
    return res.status(404).json({
      msg: "Material no encontrado",
    });
  }
  res.json(material);
};

module.exports = {
  materialesGet,
  materialGetById,
  materialesPost,
  materialesPut,
};
