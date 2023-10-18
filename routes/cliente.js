const { Router } = require("express");
const { check } = require("express-validator");

const { esRolValido, existeUsuarioID, existeClienteID } = require("../helpers/db-validators");

const { clientesGet, clientesPost, clientesPut, clientesDelete } = require("../controllers/cliente");

const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRole,
} = require("../middlewares");

const router = Router();

router.get("/", clientesGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("domicilio", "El domicilio es obligatorio").not().isEmpty(),
    check("celular", "El telefono debe ser obligatorio").not().isEmpty(),
    check("email").isEmail(),
    validarCampos,
  ],
  clientesPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioID),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  clientesPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRol,
    tieneRole('ADMIN_ROLE'),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeClienteID),
    validarCampos,
  ],
  clientesDelete
);

module.exports = router;
