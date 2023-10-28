const { Router } = require("express");
const { check } = require("express-validator");

const {
  cotizacionesGet,
  cotizacionGetById,
  cotizacionesPost,
  cotizacionesPut,
  cotizacionesDelete,
} = require("../controllers/cotizaciones");

const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRole,
} = require("../middlewares");

const router = Router();

router.get("/", cotizacionesGet);

router.get(
  "/:id",
  [check("id", "No es un ID valido").isMongoId(), validarCampos],
  cotizacionGetById
);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("concepto", "El concepto es obligatorio").not().isEmpty(),
    check("fecha", "La fecha es obligatoria").not().isEmpty(),
    check("domicilio", "El domicilio es obligatorio").not().isEmpty(),
    check("cliente", "El cliente es obligatorio").isMongoId(),
    check("materiales", "Los materiales son obligatorios").isArray({ min: 1 }),
    validarCampos,
  ],
  cotizacionesPost
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    validarCampos,
  ],
  cotizacionesPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRol,
    check("id", "No es un ID valido").isMongoId(),
    validarCampos,
  ],
  cotizacionesDelete
);

module.exports = router;
