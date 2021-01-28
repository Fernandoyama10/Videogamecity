const express = require('express');
const authController = require('../controllers/usuarios');

const router = express.Router();
          
router.post('/registro', authController.registro );

router.post('/login', authController.login );

router.post('/recomendado', authController.guardar );

router.post('/search', authController.search );

router.post('/updatestatus', authController.updatestatus );

router.post('/updateaprobar', authController.updateaprobar );

router.post('/updaterechazar', authController.updaterechazar );

router.post('/votarjuego', authController.votarjuego );

module.exports = router;