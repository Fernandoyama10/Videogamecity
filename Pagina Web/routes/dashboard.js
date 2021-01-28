var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');

/* GET home page.(index.ejs) */
router.get('/', authController.isLoggedIn, async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 

  bd.query("SELECT id_videojuego, titulo, SUBSTRING(descripcion, 1, 15) as descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos){
    
    bd.query("SELECT id_videojuego, titulo, descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos2){
   
        res.render('dashboard', { title: 'VideoGamesCity', Videojuegos:listjuegos, Videojuegos2:listjuegos2 });

        });

    });



  });


module.exports = router;