var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');

/* GET home page.(index.ejs) */
router.get('/', authController.isLoggedIn, async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 

  const { typeahead } = req.body;

      res.render('successful', { title: 'VideoGamesCity', user:req.user });


  }); 

  module.exports = router;