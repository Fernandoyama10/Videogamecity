var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
/* GET home page.(index.ejs) */
router.get('/', function(req, res, next) {
  //hacemos el select con la variable importada de conexión 
    bd.query("SELECT SUBSTRING(descripcion, 1, 60) as descripcion, titulo, imagen, votos FROM tbl_videojuegos", function(err,listjuegos){
        console.log(listjuegos);  
        res.render('index', { title: 'VideoGamesCity', Videojuegos:listjuegos  });
             
        });

  });


module.exports = router;
