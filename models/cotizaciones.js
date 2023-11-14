const { Schema, model } = require("mongoose");

const MaterialEnCotizacionSchema = new Schema({
  material: {
    type: Schema.Types.ObjectId,
    ref: "Materiales",
    require: [true, "El material es obligatorio"],
  },
  medidaUsada: {
    type: Number,
    require: [true, "La medida es obligatoria"],
  },
  precioUsado: {
    type: Number,
    require: [true, "El precio es obligatorio"],
  },
});

const CotizacionSchema = Schema({
  concepto: {
    type: String,
    require: [true, "El concepto es obligatorio"],
  },
  fecha: {
    type: String,
    require: [true, "La fecha es obligatorio"],
  },
  domicilio: {
    type: String,
    require: [true, "El domicilio es obligatorio"],
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
    require: [true, "El cliente es obligatorio"],
  },
  materiales: {
    type: [MaterialEnCotizacionSchema],
    require: [true, "Los materiales son requeridos"],
  },
  total: {
    type: Number,
    require: [true, "El precio total es obligatorio"],
  },
  completado: {
    type: Boolean,
    default: false,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

CotizacionSchema.methods.toJSON = function () {
  const { __v, _id, ...cotizacion } = this.toObject();
  cotizacion.uid = _id;
  return cotizacion;
};

module.exports = model("Cotizacion", CotizacionSchema);
