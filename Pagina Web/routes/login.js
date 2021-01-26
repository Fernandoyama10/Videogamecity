var express = require('express');
var router = express.Router();
//importamos la conexión
var bd = require("../conexion/conexion");

/* GET seccion.(productos.ejs) */
router.get('/', function(req, res, next) {
  //hacemos el select con la variable importada de conexión 
    bd.query("SELECT * FROM tbl_videojuegos", function(err,resultados){
        console.log(resultados);  

        res.render('login', { title: 'Nuestros Productos Nuevos', Libros:resultados }); 
         
        });

  });

module.exports = router;