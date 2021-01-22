var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'MYSQL5044.site4now.net',
  user     : 'a6e49f_citygam',
  password : 'kaka2020',
  database:'db_a6e49f_citygam'
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
