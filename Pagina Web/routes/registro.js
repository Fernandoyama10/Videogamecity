var express = require('express');
var router = express.Router();
//importamos la conexión
var bd = require("../conexion/conexion");

/* GET seccion.(productos.ejs) */
router.get('/', async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 
   
      const {nombre, apellido, contrasena, correo, tipousuario} = req.body;
      const newArticulo = {
          nombre,
          apellido,
          contrasena,
          correo,
          tipousuario,
      };

      console.log(newArticulo);

      await bd.query('INSERT INTO usuario set ?', [newArticulo]);



        res.render('registro', { title: 'Nuestros Productos Nuevos' }); 
         

  });

module.exports = router;