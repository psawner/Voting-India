const db = require('../db');
const bcrypt = require('bcrypt');

//it stores data into table of database
async function createuser(name, email, age, mobile, address, aadharCardNumber, password, role, isvoted,notifications,avatar,emailOtp,otpExpiry){
    const sql = 'INSERT INTO users (name, email, age, mobile, address, aadharCardNumber , password, role, isvoted, notifications, avatar, emailOtp, otpExpiry) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const [result] = await db.promise().query(sql,[name, email, age, mobile, address, aadharCardNumber, password, role, isvoted, notifications, avatar, emailOtp, otpExpiry]);
    return { id: result.insertId, name, email, age, mobile, address, aadharCardNumber, password, role, isvoted, notifications, avatar, emailOtp, otpExpiry};
}

//it takes data from database and send to 'get' request
async function showusers(){
    const sql = 'SELECT *FROM users';
    const [result] = await db.promise().query(sql);
    return result;
}

// finding all voters
async function getvoters(){
    const sql = 'SELECT *FROM users WHERE role="voter"';
    const [result] = await db.promise().query(sql);
    return result;
}

// it checks data is twice or more
async function ifexist(name,email){
    const sql = 'SELECT *FROM users WHERE name=? AND email=?';
    const [result] = await db.promise().query(sql,[name,email]);
    return result.length > 0;
}


//it finds a user by email
async function findbyemail(email){
    const sql = 'SELECT *FROM users WHERE email=?';
    const [result] = await db.promise().query(sql,[email]);
    return result[0];
}

//it finds data of users by using that id
async function findbyid(id){
    const sql = 'SELECT * FROM users WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}

//it updates data of users
async function updatedid(id,hashpassword){
    const sql = 'UPDATE users SET password=? WHERE id=?';
    const [result] = await db.promise().query(sql, [hashpassword,id]);
    return result;
}

//updating  users who has casted votes
async function updateisvoted(userid){
    const sql = 'UPDATE users SET isvoted = true WHERE id=?';
    const [result] = await db.promise().query(sql, [userid]);
    return result;
}

//only one admin 
async function adminexist(){
    const sql = 'SELECT COUNT(*) AS count FROM users WHERE role = "admin"';
    const [result] = await db.promise().query(sql);
    return result[0].count > 0; 
}

async function notificationstatus(notifications,userid){
    const sql = 'UPDATE users SET notifications=? WHERE id=?';
    const [result] = await db.promise().query(sql,[notifications,userid])
    return result;
}

//temporarily saving verification code
async function saveverifycode(userid,otp){
    const expiryTime = Date.now() + 5 * 60 * 1000;
    const sql = 'UPDATE users SET emailOtp=?,otpExpiry=? WHERE id=?';
    const [result] = await db.promise().query(sql,[otp,expiryTime,userid]);
    return result;
}

//verify otp
async function verifyotp(userid,otp){
    const sql = 'SELECT emailOtp, otpExpiry FROM users WHERE id=?';
    const [result] = await db.promise().query(sql,[userid]);
    return result;
}

// mark verified otp
async function markverified(userid){
    const sql = 'UPDATE users SET emailOtp = NULL, otpExpiry = NULL WHERE id=?';
    await db.promise().query(sql,[true,userid]);
    return true;
}
module.exports = {
    createuser,
    showusers,
    getvoters,
    ifexist,
    findbyemail,
    findbyid,
    updatedid,
    updateisvoted,
    adminexist,
    notificationstatus,
    saveverifycode,
    verifyotp,
    markverified
}
