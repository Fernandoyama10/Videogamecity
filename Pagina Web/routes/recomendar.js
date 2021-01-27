var express = require('express');
var router = express.Router();
//importamos la conexión
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');


/* GET seccion.(productos.ejs)  */
router.get('/',  authController.isLoggedIn, function(req, res, next) {

  if(!req.user) {
    res.redirect('/login');
  } else if (req.user) {
    res.render('recomendar', { title: 'Recomienda un Videojuego', user: req.user });
  }

  });

  module.exports = router;

