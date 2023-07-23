

const auth = require("./auth")
const usuario = require("./usuarios")

module.exports = {
    ...auth,
    ...usuario,
}