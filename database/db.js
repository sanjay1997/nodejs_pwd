// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'passwordManager',
//   password: '',
// });

// module.exports = pool.promise();

const mysql = require('mysql2');
const connection=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'manage_password',
});

connection.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('Connected!:)');
  }
});

module.exports = connection;
