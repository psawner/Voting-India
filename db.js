
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    dateStrings: true
})

connection.connect((err)=>{
    if(err) return console.error(err.message);

    console.log('Connected 🐕 to the MYSQL server');
})


module.exports = connection;