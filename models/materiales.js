const { Schema, model } = require("mongoose");

const MaterialesSchema = Schema({
  nombre: {
    type: String,
    require: [true, "El nombre es obligatorio"],
  },
  peso: {
    type: Number,
    require: [true, "El peso es obligatorio"],
  },
  medida: {
    type: String,
    require: [true, "El medida es obligatorio"],
  },
  precio: {
    type: Number,
    require: [true, "El precio es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

MaterialesSchema.methods.toJSON = function () {
  const { __v, _id, ...materiales } = this.toObject();
  materiales.uid = _id;
  return materiales;
};

module.exports = model("Materiales", MaterialesSchema);
