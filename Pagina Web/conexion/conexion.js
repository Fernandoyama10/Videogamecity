var mysql      = require('mysql');
var connectionn = mysql.createPool({
    port   : '19120',
  host     : 'mysql-19120-0.cloudclusters.net',
  user     : 'Brandon',
  password : '12345678',
  database:'videogames'
});

connectionn.getConnection((err,connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection failed !');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections !');
      }
      if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused !');
      }
  }
  if (connection) {
      connection.release();
      console.log('Base de datos !');
      return;
  }
});

module.exports = connectionn;

/*connection.query("SELECT * FROM tblproductos", function(err,resultados){
console.log(resultados);
});
*/

//connection.end();