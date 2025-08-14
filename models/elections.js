const db = require('../db');

//storing election's dates
async function creatingelectiondates(title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration){
    const sql = 'INSERT INTO elections (title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration) VALUES (?,?,?,?,?,?,?)';
    const [result] = await db.promise().query(sql,[title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration]);
    return result;
}

//finding dates using id
async function showdates(){
    const sql = 'SELECT *FROM elections';
    const [result] = await db.promise().query(sql);
    return result;
}

// finding all dates using id 
async function findingdatesbyid(id){
    const sql = 'SELECT *FROM elections WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}
//updating dates
async function updatedates(id,title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration){
    const sql = 'UPDATE elections SET title=?,nomination_start=?,nomination_end=?,final_candidate_list=?,voting_start=?,voting_end=?,result_declaration=? WHERE id=?';
    const [result] = await db.promise().query(sql,[title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration,id]);
    return result;
}

//deleting dates
async function deletingdates(id){
    const sql = 'DELETE FROM elections WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}

module.exports = {
    creatingelectiondates,
    showdates,
    updatedates,
    deletingdates,
    findingdatesbyid
}