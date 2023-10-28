const { Router } = require("express");
const { check } = require("express-validator");

const {
  existeMaterialID, // Esto es una función que deberías crear en db-validators
} = require("../helpers/db-validators");

const {
  materialesGet,
  materialGetById,
  materialesPost,
  materialesPut,
} = require("../controllers/materiales"); // Asegúrate de que estos controladores se encuentren en el archivo indicado

const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRole,
} = require("../middlewares");

const router = Router();

router.get("/", materialesGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMaterialID),
    validarCampos,
  ],
  materialGetById
);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("peso", "El peso es obligatorio").not().isEmpty(),
    check("medida", "La medida es obligatoria").not().isEmpty(),
    check("precio", "El precio es obligatorio").isNumeric(),
    validarCampos,
  ],
  materialesPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMaterialID),
    validarCampos,
  ],
  materialesPut
);

module.exports = router;
