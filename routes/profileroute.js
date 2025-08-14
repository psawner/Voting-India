const express = require('express');
const router = express.Router();
const profile = require('./../models/profile');

router.post('/',async (req,res)=>{
    const {name,father,mother,address,age,gender,profession,income} = req.body;
  
    if(!name || !father || !mother || !address || !age || !gender || !profession || !income){
      return res.status(400).send('all fields are required');
    }
    try{
      await profile.userdata(name,father,mother,address,age,gender,profession,income);
      res.send('user stored their info 😊');
    }catch(err){
      console.error('db error:',err);
      res.status(500).send('database error');
    }
})

router.get('/',async (req,res)=>{
    try{
      const data = await profile.showdata();
      res.json(data);
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})
  
  
router.get('/:professiontype',async (req,res)=>{
    try{
      const professiontype = req.params.professiontype;
      if(professiontype =='teacher' || professiontype =='engineer' || professiontype ==='doctor' ||professiontype =='student'){
        const response = await profile.showdata({profession: professiontype});
        res.status(200).json(response);
      }else{
        res.status(404).json({error: "invalid profession type"});
      }
        
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})

module.exports = router;
  


/*
//we can use this as well as upper code specially in this code after '/' we use 'profile' but we do not need to write this as well because in routes we use it
router.post('/profile',async (req,res)=>{
    const {name,father,mother,address,age,gender,profession,income} = req.body;
  
    if(!name || !father || !mother || !address || !age || !gender || !profession || !income){
      return res.status(400).send('all fields are required');
    }
    try{
      await profile.userdata(name,father,mother,address,age,gender,profession,income);
      res.send('user stored their info 😊');
    }catch(err){
      console.error('db error:',err);
      res.status(500).send('database error');
    }
})

router.get('/profile',async (req,res)=>{
    try{
      const data = await profile.showdata();
      res.json(data);
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})
  
  
router.get('/profile/:professiontype',async (req,res)=>{
    try{
      const professiontype = req.params.professiontype;
      if(professiontype =='teacher' || professiontype =='engineer' || professiontype ==='doctor' ||professiontype =='student'){
        const response = await profile.showdata({profession: professiontype});
        res.status(200).json(response);
      }else{
        res.status(404).json({error: "invalid profession type"});
      }
        
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})

module.exports = router;
  
*/