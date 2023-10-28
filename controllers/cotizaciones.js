const { response } = require("express");

const Cotizacion = require("../models/cotizaciones");
const Materiales = require("../models/materiales");

const cotizacionesGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, cotizaciones] = await Promise.all([
    Cotizacion.countDocuments(query),
    Cotizacion.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("cliente")
      .populate("materiales.material"),
  ]);

  res.json({
    total,
    cotizaciones,
  });
};

const cotizacionGetById = async (req, res = response) => {
  const { id } = req.params;
  const cotizacion = await Cotizacion.findById(id)
    .populate("cliente")
    .populate("materiales.material");

  if (!cotizacion) {
    return res.status(404).json({
      msg: "Cotización no encontrada",
    });
  }
  res.json(cotizacion);
};

const cotizacionesPost = async (req, res = response) => {
  const { concepto, fecha, domicilio, cliente, materiales } = req.body;

  let total = 0;

  for (let i = 0; i < materiales.length; i++) {
    let materialCotizacion = materiales[i];

    const materialDB = await Materiales.findById(materialCotizacion.material);

    if (materialDB) {
      total +=
        (materialCotizacion.medidaUsada / materialDB.medida) *
        materialDB.precio;
    } else {
      return res.status(400).json({
        msg: `El material con id ${materialCotizacion.material} no fue encontrado.`,
      });
    }
  }

  const data = {
    concepto,
    fecha,
    domicilio,
    cliente,
    materiales,
    total,
  };

  const cotizacion = new Cotizacion(data);
  await cotizacion.save();

  res.json({
    cotizacion,
  });
};

const cotizacionesPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  const cotizacion = await Cotizacion.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!cotizacion) {
    return res.status(404).json({
      msg: "Cotización no encontrada",
    });
  }

  res.json(cotizacion);
};

const cotizacionesDelete = async (req, res = response) => {
  const { id } = req.params;
  const cotizacion = await Cotizacion.findByIdAndUpdate(id, { estado: false });

  if (!cotizacion) {
    return res.status(404).json({
      msg: "Cotización no encontrada",
    });
  }

  res.json(cotizacion);
};

module.exports = {
  cotizacionesGet,
  cotizacionGetById,
  cotizacionesPost,
  cotizacionesPut,
  cotizacionesDelete,
};
