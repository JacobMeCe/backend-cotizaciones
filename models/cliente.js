const { Schema, model } = require("mongoose");

const ClienteSchema = Schema({
  nombre: {
    type: String,
    require: [true, "El nombre es obligatorio"],
  },
  domicilio: {
    type: String,
    require: [true, "El domicilio es obligatorio"],
  },
  celular: {
    type: String,
    require: [true, "El celular es obligatorio"],
  },
  email: {
    type: String,
    require: [true, "El email es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

ClienteSchema.methods.toJSON = function() {
  const { __v, _id, ...cliente } = this.toObject();
  cliente.uid = _id;
  return cliente;
}

module.exports = model("Cliente", ClienteSchema);
