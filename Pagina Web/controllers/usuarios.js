const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

var bd = require("../conexion/conexion");

exports.login = async (req, res) => {
    
  try {
    const { correo, contrasena } = req.body;
    console.log(req.body);
    if( !correo || !contrasena ){
      return res.status(400).render('login', {
        message : 'Por favor proporciona una contraseña o correo.'
      })
    }


    bd.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, results) => {

        if(results.length > 0) {
          
          if( !results[0].correo || !(await bcrypt.compare(contrasena, results[0].contrasena)) ) {
            res.status(401).render('login', {
              message: 'Correo o contraseña invalido.'
            })
          } else {

            const id = results[0].id_usuario;
    
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN
            });
    
            console.log("The token is: " + token);
    
            const cookieOptions = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true
            }
    
            res.cookie('jwt', token, cookieOptions );
            res.status(200).redirect("/");
          }
        }else {
            return res.render('login', {
                message: 'Correo o contraseña invalido.'
            });
        }




      if(error){
        console.log(error);
    }

    if(results.length > 0) {
      
      if( !results[0].correo || !(await bcrypt.compare(contrasena, results[0].contrasena)) ) {
        res.status(401).render('login', {
          message: 'Correo o contraseña invalido.'
        })
      } else {

        
        const id = results[0].id_usuario;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log("The token is: " + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions );
        res.status(200).redirect("/");
      }
    }else {
        return res.render('login', {
            message: 'Correo o contraseña invalido.'
        });
    }


    })

    
    

    } catch (error) {
      console.log(error);
    }
}
exports.search = async (req, res) => {
    
  try {
      const { typeahead }= req.body;

      if( !typeahead ){
        return res.status(400).render('videojuegos', {
          message : 'Por favor proporciona una contraseña o correo'
        })
      }

      bd.query("SELECT * from tbl_videojuegos where titulo like '%" + [typeahead] + "%' ", async (error,lista) =>{
        console.log("JUEGOSELECCIONADO ES");
        console.log(lista);
        res.status(200).redirect("/videojuegos");
        req.listgames = lista[0];
        if( !lista ) {
          res.status(401).render('videojuegos', {
            message: 'No se encontraron videojuegos relacionados'
          });
        } else {
         

          if(!result) {
            return next();
          }
  
         
       


        
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
        return res.render('login',{messageregister: "Usuario Registrado!"});
        
    }
}); 

    }); 
}

exports.guardar =  async (req, res, next) => {
  // console.log(req.cookies);
  const {titulo, descripcion, votos='1', id_estatus='2'} = req.body;
  //const puntos = 0;
  var puntos = 0;
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


      if(results.length <= 0){     

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
                                messagessucces: 'Videojuego Registrado correctamente'
                              });
                          }
                      });
                     
                  }
              });   
    
          }
      });

      }
      if(results.length > 0){

      bd.query('SELECT titulo FROM tbl_videojuegos WHERE id_estatus= 2 AND titulo = ?', [titulo], async (error,results2) =>{
        if(error){
            console.log(error);
        }

        if(results2.length > 0){

          console.log("ENTRA PARA ACTIVAR EL MENSAJE DE VIDEO JUEGO REGISTRADO NO APROBADO");
          return res.render('recomendar', {
            message: 'Videojuego ya esta registrado, pero NO SE HA APROBADO'
           });  
        }
        if(results2.length <= 0) {

            //aquí va procesar el puntaje
          bd.query('SELECT votos FROM tbl_videojuegos where titulo = ?',[titulo] ,async (error, totalvot) => {
            if(error){
                console.log(error);
        
            }if(totalvot.length > 0) {
                console.log(totalvot);
                puntos = totalvot[0].votos + 1;
                console.log(puntos);
                bd.query('UPDATE tbl_videojuegos SET votos = ' + [puntos] +' WHERE titulo = ?', [titulo],(error, results) => {
                    if(error){
                        console.log(error);
                        console.log("ERROR EL SQL EN LA SINTAXIS");
                
                    }else {
                      console.log("ENTRA PARA ACTIVAR EL MENSAJE");
                         return res.render('recomendar', {
                          precaucion: 'Videojuego ya esta registrado se conto el VOTO'
                      });
                      
                    }
                });
               
            }
           
          });
            
        }
        
    }); 
      }

     }); 

    } catch (error) {
      console.log(error);

      return next();
    }
  } else {
    next();
  }
}


exports.updatestatus = async  (req, res, next) => {
  console.log(req.body);
    const {titulo, descripcion, imagen, id_videojuego} = req.body;


    bd.query("SELECT id_videojuego, titulo, SUBSTRING(descripcion, 1, 15) as descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos){
    
      bd.query("SELECT id_videojuego, titulo, descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos2){
     
        bd.query('UPDATE tbl_videojuegos SET titulo ="' + [titulo] +'", descripcion ="' + [descripcion] +'", imagen ="' + [imagen] +'" WHERE id_videojuego ="' + [id_videojuego] +'"',(error, results) => {
          if(error){
            console.log(error);
            console.log("ERROR EL SQL EN LA SINTAXIS");
        
        }else {
          console.log("ENTRA PARA ACTIVAR EL MENSAJE");
            res.render('dashboard', { aviso: 'Juego actualizado', Videojuegos:listjuegos, Videojuegos2:listjuegos2});
        
        }
        }); 
  
          });
  
      });



    


}


exports.updateaprobar = async  (req, res, next) => {
  console.log(req.body);
    const {id_estatus, id_videojuego} = req.body;


    bd.query("SELECT id_videojuego, titulo, SUBSTRING(descripcion, 1, 15) as descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos){
    
      bd.query("SELECT id_videojuego, titulo, descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos2){
     
        bd.query('UPDATE tbl_videojuegos SET id_estatus ="' + [id_estatus] +'" WHERE id_videojuego = ?', [id_videojuego],(error, results) => {
          if(error){
            console.log(error);
            console.log("ERROR EL SQL EN LA SINTAXIS");
        
        }else {
          console.log("ENTRA PARA ACTIVAR EL MENSAJE");
            res.render('dashboard', { aviso: 'Juego Aprobado', Videojuegos:listjuegos, Videojuegos2:listjuegos2});
        
        }
        }); 
  
          });
  
      });



    


}
/* */

exports.updaterechazar = async  (req, res, next) => {
  console.log(req.body);
    const {titulo, descripcion, imagen, id_estatus, id_videojuego} = req.body;


    bd.query("SELECT id_videojuego, titulo, SUBSTRING(descripcion, 1, 15) as descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos){
    
      bd.query("SELECT id_videojuego, titulo, descripcion, imagen, votos, estatus FROM tbl_videojuegos INNER JOIN estatus ON estatus.id_estatus = tbl_videojuegos.id_estatus ORDER BY tbl_videojuegos.id_estatus DESC", function(err,listjuegos2){
     
        bd.query('UPDATE tbl_videojuegos SET id_estatus ="' + [id_estatus] +'" WHERE id_videojuego = ?', [id_videojuego],(error, results) => {
          if(error){
            console.log(error);
            console.log("ERROR EL SQL EN LA SINTAXIS");
        
        }else {
          console.log("ENTRA PARA ACTIVAR EL MENSAJE");
            res.render('dashboard', { aviso: 'Juego Rechazado', Videojuegos:listjuegos, Videojuegos2:listjuegos2});
        
        }
        }); 
  
          });
  
      });

}

exports.votarjuego = async  (req, res, next) => {


  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);


  console.log(req.body);


  bd.query('SELECT id_usuario, SUBSTRING(nombre, 1, 15) as nombre, apellido, contrasena, correo, id_tipouser FROM usuario WHERE id_usuario = ?', [decoded.id], (error, datos) => {
    console.log(datos);


    const {id_videojuego} = req.body;
    var puntos = 0;
    bd.query("SELECT SUBSTRING(descripcion, 1, 60) as descripcion, SUBSTRING(titulo, 1, 27) as titulo, id_videojuego, imagen, votos FROM tbl_videojuegos WHERE id_estatus = 1 ORDER BY votos DESC", function(err,listjuegos){

      bd.query("SELECT descripcion, titulo, id_videojuego, imagen, votos FROM tbl_videojuegos WHERE id_estatus = 1 ORDER BY votos DESC", function(err,listjuegos2){

    bd.query('SELECT votos FROM tbl_videojuegos where id_videojuego = ?',[id_videojuego] ,async (error, totalvot) => {
      if(error){
          console.log(error);
  
      }if(totalvot.length > 0) {
          console.log(totalvot);
          puntos = totalvot[0].votos + 1;
          console.log(puntos);
          bd.query('UPDATE tbl_videojuegos SET votos = ' + [puntos] +' WHERE id_videojuego = ?', [id_videojuego],(error, results) => {
              if(error){
                  console.log(error);
          
              }else {
               return res.render('index', {
                    messagessucces: 'Voto registrado Correctamente', Videojuegos:listjuegos, Videojuegos2:listjuegos2, user:datos });   
              }
          });
         
      }
  });


      });

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