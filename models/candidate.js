const db = require('../db');

//it stores data into table of database
async function createcandidates(name, party, age, votes, voteCount){
    const sql = 'INSERT INTO candidates (name, party, age, votes, voteCount) VALUES (?,?,?,?,?)';
    const [result] = await db.promise().query(sql,[name, party, age, votes, voteCount]);
    return result;
}

//it takes data from database and send to 'get' request
async function showcandidates(){
    const sql = 'SELECT *FROM candidates';
    const [result] = await db.promise().query(sql);
    return result;
}

//it finds data of users by using that id
async function findbycandidateid(id){
    const sql = 'SELECT *FROM candidates WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}

async function updatecandidate(id,name,party,age){
    const sql = 'UPDATE candidates SET name=?, party=?, age=? WHERE id=?';
    const [result] = await db.promise().query(sql, [name,party,age,id]);
    return result;
}

async function deletecandidate(id){
    const sql = 'DELETE FROM candidates WHERE id=?';
    const [result] = await db.promise().query(sql,[id]);
    return result;
}
//counting votes
async function incrementvote(candidateid){
    const sql = 'UPDATE candidates SET voteCount = voteCount + 1 WHERE id=?';
    const [result] = await db.promise().query(sql,[candidateid]);
    return result;
}

// who voted for whom
async function recordvote(userid,candidateid){
    const sql = 'INSERT INTO votes (user_id,candidate_id) VALUES(?,?)';
    const [result] = await db.promise().query(sql,[userid,candidateid]);
    return result;
}

//vote counts in sorted manner
async function getallcandidatesbyvotecount(){
    const sql = 'SELECT name, party, voteCount FROM candidates ORDER BY voteCount DESC';
    const [result] = await db.promise().query(sql);
    return result;
}

module.exports = {
    createcandidates,
    showcandidates,
    findbycandidateid,
    updatecandidate,
    deletecandidate,
    incrementvote,
    recordvote,
    getallcandidatesbyvotecount
}
