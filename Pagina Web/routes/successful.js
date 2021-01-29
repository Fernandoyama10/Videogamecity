var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');

/* GET home page.(index.ejs) */
router.get('/', authController.isLoggedIn, async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 

  

      res.render('successful', { title: '¡Gracias por tu Voto!', mensaje: '¡Gracias por tu Voto!' });


  }); 
  router.get('/error', authController.isLoggedIn, async function(req, res, next) {
    //hacemos el select con la variable importada de conexión 
  
    
  
        res.render('successful', { title: 'Error', mensaje: 'Lo siento, ya has votado por este videojuego. Vota por otro.' });
  
  
    }); 
  module.exports = router;