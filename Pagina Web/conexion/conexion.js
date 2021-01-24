
var mysql      = require('mysql');
<<<<<<< Updated upstream
var connection = mysql.createConnection({
=======
var connection = mysql.createPool({
>>>>>>> Stashed changes
  host     : 'MYSQL5044.site4now.net',
  user     : 'a6e49f_citygam',
  password : 'kaka2020',
  database:'db_a6e49f_citygam'
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