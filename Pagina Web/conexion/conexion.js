var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'SQL5101.site4now.net',
  user     : 'DB_A6E49F_videogamecity_admin',
  password : 'kaka2020',
  database:'DB_A6E49F_videogamecity'
});

connection.connect(
  (err)=>{
    if(!err){console.log("conexion establecida");}
    else{console.log("error en conexion");}
  }
);
//exportamos la conexión
module.exports=connection;


/*connection.query("SELECT * FROM tblproductos", function(err,resultados){

console.log(resultados);  

}
);

connection.end();*/
