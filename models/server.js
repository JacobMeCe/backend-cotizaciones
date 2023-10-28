const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      clientes: "/api/clientes",
      materiales: "/api/materiales",
      cotizaciones: "/api/cotizaciones",
    };

    //Conectar a base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y Parseo del body
    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.clientes, require("../routes/cliente"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.materiales, require("../routes/materiales"));
    this.app.use(this.paths.cotizaciones, require("../routes/cotizaciones"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor en ", this.port);
    });
  }
}

module.exports = Server;
