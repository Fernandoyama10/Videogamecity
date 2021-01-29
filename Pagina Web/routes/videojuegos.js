var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');

/* GET home page.(index.ejs) */
router.post('/', authController.isLoggedIn, async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 

  const { typeahead } = req.body;

    bd.query('SELECT SUBSTRING(descripcion, 1, 80) as descripcion, SUBSTRING(titulo, 1, 27) as titulo, id_videojuego, imagen, votos from tbl_videojuegos where titulo like "%'+[typeahead]+'%" && id_estatus=1', async function(err,listjuegos){
      
        res.render('videojuegos', { title: 'VideoGamesCity', Videojuegos : listjuegos, user : req.user  });

        });

  }); 

  module.exports = router;