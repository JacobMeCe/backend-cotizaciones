const { response } = require("express");
const PDFDocument = require("pdfkit");

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
      .sort({ fecha: -1 })
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
  let materialesConPrecio = [];

  for (let i = 0; i < materiales.length; i++) {
    let materialCotizacion = materiales[i];
    const materialDB = await Materiales.findById(materialCotizacion.material);
    if (materialDB) {
      let precioUsado =
        (materialCotizacion.medidaUsada / materialDB.medida) *
        materialDB.precio;
      total += precioUsado;
      materialCotizacion.precioUsado = precioUsado;
      materialesConPrecio.push(materialCotizacion);
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
    materiales: materialesConPrecio,
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
  const cotizacion = await Cotizacion.findByIdAndUpdate(id, {
    completado: true,
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

const cotizacionExportarPDF = async (req, res) => {
  const { id } = req.params;
  const cotizacion = await Cotizacion.findById(id)
    .populate("cliente")
    .populate("materiales.material");

  if (!cotizacion) {
    return res.status(404).json({
      msg: "Cotización no encontrada",
    });
  }

  const tallerNombre = "Herreria Padilla";
  const tallerDomicilio = "Gonzalez Bocanegra #13 colonia IPEVI";
  const tallerTelefono = "312 123 4567";

  const doc = new PDFDocument();
  let y = 50;

  doc.font("Helvetica");

  doc.text(`Nombre del Taller: ${tallerNombre}`, 50, y);
  y += 20;
  doc.text(`Domicilio del Taller: ${tallerDomicilio}`, 50, y);
  y += 20;
  doc.text(`Teléfono del Taller: ${tallerTelefono}`, 50, y);
  y += 30;

  const fecha = new Date(cotizacion.fecha);
  const fechaFormateada = fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  doc.text(`Concepto: ${cotizacion.concepto}`, 50, y);
  y += 20;
  doc.text(`Fecha: ${fechaFormateada}`, 50, y);
  y += 20;
  doc.text(`Domicilio: ${cotizacion.domicilio}`, 50, y);
  y += 20;
  doc.text(`Cliente: ${cotizacion.cliente.nombre}`, 50, y);
  y += 30;
  doc.text(`Materiales`, 50, y);
  y += 20;

  const headers = [
    "Nombre",
    "Medida total",
    "Medida de uso",
    "Precio",
    "Costo",
  ];
  const columnWidths = [150, 100, 100, 70, 70];
  const tableTop = y;
  const cellHeight = 20;
  const headerCellHeight = 30;
  const contentMargin = 5;

  headers.forEach((header, i) => {
    const x = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
    const width = columnWidths[i];
    doc
      .font("Helvetica-Bold")
      .text(
        header,
        x + contentMargin,
        y + headerCellHeight / 2 - doc.currentLineHeight() / 2,
        { width: width - contentMargin * 2, align: "center" }
      );
  });

  doc.font("Helvetica");
  y += headerCellHeight;

  cotizacion.materiales.forEach((material, index) => {
    let x = 50;
    headers.forEach((header, i) => {
      const width = columnWidths[i];
      let text;
      switch (i) {
        case 0:
          text = material.material.nombre;
          break;
        case 1:
          text = material.material.medida + "cm";
          break;
        case 2:
          text = material.medidaUsada + "cm";
          break;
        case 3:
          text = `$${material.material.precio}`;
          break;
        case 4:
          text = `$${material.precioUsado}`;
          break;
      }
      doc.text(
        text,
        x + contentMargin,
        y + cellHeight / 2 - doc.currentLineHeight() / 2,
        { width: width - contentMargin * 2, align: "center" }
      );
      x += width;
    });
    y += cellHeight;
  });

  y = tableTop;

  doc
    .moveTo(50, y)
    .lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();
  y += headerCellHeight;

  for (let i = 0; i <= cotizacion.materiales.length; i++) {
    doc
      .moveTo(50, y)
      .lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y)
      .stroke();
    y += cellHeight;
  }

  let x = 50;
  for (let i = 0; i <= headers.length; i++) {
    doc
      .moveTo(x, tableTop)
      .lineTo(x, y - cellHeight)
      .stroke();
    x += i < headers.length ? columnWidths[i] : 0;
  }

  doc.font("Helvetica-Bold").text(`Total: $${cotizacion.total}`, 50, y);

  doc.end();
  res.setHeader("Content-disposition", "attachment; filename=cotizacion.pdf");
  res.setHeader("Content-type", "application/pdf");
  doc.pipe(res);
};

module.exports = {
  cotizacionesGet,
  cotizacionGetById,
  cotizacionesPost,
  cotizacionesPut,
  cotizacionesDelete,
  cotizacionExportarPDF,
};
