var express = require('express');
var router = express.Router();
var bd = require("../conexion/conexion");
const authController = require('../controllers/usuarios');

/* GET home page.(index.ejs) */
router.get('/', authController.isLoggedIn, async function(req, res, next) {
  //hacemos el select con la variable importada de conexión 


    bd.query("SELECT SUBSTRING(descripcion, 1, 60) as descripcion, titulo, imagen, votos FROM tbl_videojuegos WHERE id_estatus = 1 ORDER BY votos DESC", function(err,listjuegos){
        console.log(listjuegos);  
        res.render('index', { title: 'VideoGamesCity', Videojuegos:listjuegos, user: req.user  });

        });

  });

  router.get('/searchtool',function(req,res){
    bd.query('SELECT titulo from tbl_videojuegos where titulo like "%'+req.query.key+'%"', function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++)
          {
            data.push(rows[i].titulo);
 
          }
          res.end(JSON.stringify(data));
      });
    });
 

  router.get('/logout', authController.logout );

module.exports = router;