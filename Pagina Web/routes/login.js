var express = require('express');
var router = express.Router();
//importamos la conexión
const authController = require('../controllers/usuarios');


/* GET seccion.(productos.ejs)  */
router.get('/',  authController.isLoggedIn, function(req, res, next) {

   
  if(!req.user) {

    
    res.render('login', { title: 'Login', user: req.user });


  } else if (req.user) {
    res.redirect('/');
  }
 

  });




  module.exports = router;

