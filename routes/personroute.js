const express = require('express');
const router = express.Router();
const person = require('./../models/person');

// it receives data from frontend and send to database to save data using 'post'
router.post('/',async (req,res)=>{
    const {name,email} = req.body
  
    if(!name || !email){
      return res.status(400).send('Name and email required');
    }
  
    try{
      const ifexist = await person.ifexist(name,email);
      if(ifexist){
        return res.status(409).send('user already exist');
      }
  
      await person.createuser(name,email);
      res.send('user created 😊');
  
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
   
})

// it shows or fetch data on web using 'get'
router.get('/',async (req,res)=>{
  
    try{
      const users = await person.showusers();
      res.json(users);
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})
 
//for updating some info in frontend , to get that updated things we use "put or patch"
router.put('/:id',async (req,res)=>{

  const personid = req.params.id;
  const {name,email} = req.body;

  try{
    const personauth = await person.findbyid(personid);
    if(!personauth){
      return res.status(404).send('person not found');
    }
    const result =await person.updatedid(personid,name,email)
    res.status(200).send('Data updated Successfully 😊');

  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

// for deleting data of a user
router.delete('/:id',async (req,res)=>{
  const personid = req.params.id;
  try{

    const result = await person.findbyid(personid);
    if(!result){
      return res.status(404).send('person not found');
    }
    await person.deletebyid(personid);
    res.status(200).send("Successfully deletd 🗑️ ");

  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})
module.exports = router;











/*
//we can use this as well as upper code specially in this code after '/' we use 'users' but we do not need to write this as well because in routes we use it

// it shows data on web using 'get'
router.get('/users',async (req,res)=>{
  
    try{
      const users = await person.showusers();
      res.json(users);
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})
  
// it receives data from frontend and send to database using 'post'
router.post('/users',async (req,res)=>{
    const {name,email} = req.body
  
    if(!name || !email){
      return res.status(400).send('Name and email required');
    }
  
    try{
      const ifexist = await person.ifexist(name,email);
      if(ifexist){
        return res.status(409).send('user already exist');
      }
  
      await person.createuser(name,email);
      res.send('user created 😊');
  
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
   
})

*/