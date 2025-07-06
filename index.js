require('dotenv').config();
const express = require('express')
const app = express();

//database
const db = require('./db');
//const person = require('./models/person');
//const profile = require('./models/profile');

//Middleware
const bodyParser =require('body-parser');
app.use(bodyParser.json());

//routes
const personroutes = require('./routes/personroute');
const profileroutes = require('./routes/profileroute');
app.use('/users',personroutes);
app.use('/profile',profileroutes);

// it shows data on web using 'get'
app.get('/', function (req, res) {
  res.send('Welcome to Tech world')
})

app.get('/room', (req,res)=>{
    res.send('welcome to your room')
})

const port = 3000;
app.listen(port,()=>{
    console.log("server is roaring 🚀");
})












































/*app.get('/users',async (req,res)=>{
  
  try{
    const users = await person.showusers();
    res.json(users);
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})
*/
/*app.get('/profile',async (req,res)=>{
  try{
    const data = await profile.showdata();
    res.json(data);
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})


app.get('/profile/:professiontype',async (req,res)=>{
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
*/
// it receives data from frontend and send to database using 'post'
/*app.post('/users',async (req,res)=>{
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

/*
app.post('/profile',async (req,res)=>{
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
*/
