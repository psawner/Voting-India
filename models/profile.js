const db = require('../db');

async function userdata(name,father,mother,address,age,gender,profession,income){
    const sql = 'INSERT INTO profile (name,father,mother,address,age,gender,profession,income) VALUES(?,?,?,?,?,?,?,?)';
    const [result] = await db.promise().query(sql,[name,father,mother,address,age,gender,profession,income]);
    return result;
}

async function showdata(filter){
    let sql = 'SELECT *FROM profile';
    let values = [];
    if(filter && filter.profession){
        sql += ' WHERE profession = ?';
        values.push(filter.profession);
    }
    const [result] = await db.promise().query(sql,values);
    return result;
}

module.exports = { userdata,showdata};
