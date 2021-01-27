const express = require('express');
const authController = require('../controllers/usuarios');

const router = express.Router();
          
router.post('/registro', authController.registro );

router.post('/login', authController.login );

router.post('/recomendado', authController.guardar );

router.post('/search', authController.search );

module.exports = router;