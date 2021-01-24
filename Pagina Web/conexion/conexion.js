
var mysql      = require('mysql');
var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database:'videogames'
});

connection.getConnection((err, conn) =>{
  if (err) {
      if (err.code == 'PROTOCOL_CONNECTION_LOST'){
          console.error('LA CONEXIONES DE LA BASE DE DATOS FUE CERRADA');
      }
     if(err.code == 'ER_CON_COUNT_ERROR') {
          console.error('LA BASE DE DATOS TIENE MUCHAS CONEXIONES');
     }
     if (err.code == 'ECONNREFUSED') {
         console.error('LA CONEXIONES DE LA BASE DE DATOS FUE RECHAZADA');
     }
  }
  if (conn) conn.release();
  console.log('BD is Connected');
  return;
});

module.exports=connection;

/*connection.query("SELECT * FROM tblproductos", function(err,resultados){
console.log(resultados);
});
*/

//connection.end();