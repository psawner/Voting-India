const db = require('../db');

//it stores data into table of database
async function createuser(name,email){
    const sql = 'INSERT INTO users (name,email) VALUES (?,?)';
    const [result] = await db.promise().query(sql,[name,email]);
    return result;
}

//it takes data from database and send to 'get' request
async function showusers(){
    const sql = 'SELECT *FROM users';
    const [result] = await db.promise().query(sql);
    return result;
}

// it checks data is twice or more
async function ifexist(name,email){
    const sql = 'SELECT *FROM users WHERE name=? AND email=?';
    const [result] = await db.promise().query(sql,[name,email]);
    return result.length > 0;
}

//it finds data of users by using that id
async function findbyid(id){
    const sql = 'SELECT *FROM users WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}

//it updates data of users
async function updatedid(id,name,email){
    const sql = 'UPDATE users SET name=?, email=? WHERE id=?';
    const [result] = await db.promise().query(sql, [name,email,id]);
    return result;
}

//it deletes data of users
async function deletebyid(id){
    const sql = 'DELETE FROM users WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}

module.exports = {createuser,showusers,ifexist,findbyid,updatedid,deletebyid};