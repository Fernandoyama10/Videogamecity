var express = require('express');
var router = express.Router();
//importamos la conexión
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');


/* GET seccion.(productos.ejs)  */
router.get('/',  authController.isLoggedIn, function(req, res, next) {

  console.log(req.user);
  if(!req.user) {
    res.render('login', { title: 'Nuestros Productos Nuevos', user: req.user });
  } else if (req.user) {
    res.redirect('/');
  }
 

  });




  module.exports = router;

