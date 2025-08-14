const db = require('../db');

async function createnotification(user_id, title, message){
    const sql = 'INSERT INTO notification (user_id,title,message) VALUES (?,?,?)';
    const [result] = await db.promise().query(sql,[user_id,title,message]);
    return result;
}

//fetch notification for user
async function getnotification(user_id){
    const sql = 'SELECT *FROM notification WHERE user_id=? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) ORDER BY created_at DESC';
    const [result] = await db.promise().query(sql,[user_id]);
    return result;
}

//mark notification as read
async function markasread(notificationid){
    const sql = 'UPDATE notification SET is_read = 1 where id=?';
    const [result] = await db.promise().query(sql,[notificationid]);
    return result;
}


module.exports = {
    createnotification,
    getnotification,
    markasread
};