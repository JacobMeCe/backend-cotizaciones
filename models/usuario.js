const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    require: [true, "El nombre es obligatorio"],
  },
  username: {
    type: String,
    require: [true, "El username es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "El password es obligatorio"],
  },
  rol: {
    type: String,
    require: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioSchema.methods.toJSON = function() {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

module.exports = model("Usuario", UsuarioSchema);
