var express = require('express');
var router = express.Router();
//importamos la conexión
const authController = require('../controllers/usuarios');

/* GET seccion.(productos.ejs) */
router.get('/', authController.isLoggedIn, function(req, res, next) {
  //hacemos el select con la variable importada de conexión 
  console.log(req.user);
  if(!req.user) {
    res.render('registro', { title: 'Registrate - Videogamecity', user: req.user });
  } else if (req.user) {
    res.redirect('/');
  }
  });


module.exports = router;