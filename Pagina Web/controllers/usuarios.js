const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

var bd = require("../conexion/conexion");

exports.login = async (req, res) => {
    
    try {
        const { correo, contrasena}= req.body;
  
        if( !correo || !contrasena ){
          return res.status(400).render('login', {
            message : 'Por favor proporciona una contraseña o correo'
          })
        }
  
        bd.query('SELECT id_usuario, SUBSTRING(nombre, 1, 12) as nombre, apellido, contrasena, correo, id_tipouser FROM usuario WHERE correo = ?', [correo], async (error,results) =>{
          console.log(results);
          if( !results || !(await bcrypt.compare(contrasena, results[0].contrasena))) {
            res.status(401).render('login', {
              message: 'Correo o Contraseña son incorrectas'
            });
          } else {
            const id = results[0].id_usuario;
  
            const token =jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN
            });
  
            console.log("the token is:" + token);
  
            const cookieOptions = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true 
            }
            res.cookie('jwt', token, cookieOptions);
  
            res.status(200).redirect("/");
  
          }
  
        })
        
        
  
        } catch (error) {
          console.log(error);
        }
  
}


exports.registro = (req, res) => {
    console.log(req.body);
    const {nombre, apellido, contrasena, correo, id_tipouser='1', passwordConfirm} = req.body;
  
    bd.query('SELECT correo FROM usuario WHERE correo = ?', [correo], async (error,results) =>{
        if(error){
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('registro', {
                message: 'El correo esta en uso'
            });
        }else if(contrasena !== passwordConfirm) {
            return res.render('registro', {
                message: 'Contraseñas no coinciden'
            });
        }

        let hashedPassword = await bcrypt.hash(contrasena, 8);
console.log(hashedPassword);


bd.query('INSERT INTO usuario set ?', {nombre : nombre,apellido : apellido, correo : correo, contrasena : hashedPassword, id_tipouser : id_tipouser}, (error, results) => {
    if(error){
        console.log(error);

    }else {
        console.log(results);
        return res.render('registro', {
            message: 'Usuario registrado'
        });
    }
});
    }); 
}

exports.guardar = async (req, res, next) => {
  // console.log(req.cookies);
  const {titulo, descripcion, votos='1', id_estatus='2'} = req.body;
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);
      //2) Check if the user still exists

     // console.log(req.body);

      bd.query('SELECT titulo FROM tbl_videojuegos WHERE titulo = ?', [titulo], async (error,results) =>{
          if(error){
              console.log(error);
          }
  
          if(results.length > 0) {
              return res.render('recomendar', {
                  message: 'El video juego ya se encuentra registrado'
              });
              //aquí podría registrar el punto del video juego si se encuentra registrado.
          }
          
      bd.query('INSERT INTO tbl_videojuegos set ?', {titulo : titulo, descripcion : descripcion, votos : votos, id_estatus : id_estatus}, (error, results) => {
      if(error){
          console.log(results);
          return res.render('recomendar', {
              messages: 'Videojuego no fue registrado'
          });
  
      }else{
          console.log(results);
          bd.query('SELECT id_videojuego FROM tbl_videojuegos where titulo = ?',[titulo] ,async (error, id_video) => {
              if(error){
                  console.log(error);
          
              }else {
                  console.log(id_video);
                  bd.query('INSERT INTO tbl_recomendaciones set ?', {id_usuario:decoded.id,id_videojuego:id_video[0].id_videojuego},(error, results) => {
                      if(error){
                          console.log(error);
                          console.log(id_video);
                  
                      }else {
                          console.log(results);
                          return res.render('recomendar', {
                            messagesuccess: 'Videojuego Registrado correctamente'
                            
                          });
                      }
                  });
                 
              }
          });

      }
  });
      }); 


    } catch (error) {
      console.log(error);

      return next();
    }
  } else {
    next();
  }
}



exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies);
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);

      //2) Check if the user still exists
      bd.query('SELECT id_usuario, SUBSTRING(nombre, 1, 15) as nombre, apellido, contrasena, correo, id_tipouser FROM usuario WHERE id_usuario = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        console.log("user is")
        console.log(req.user);
        return next();

      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}


exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}