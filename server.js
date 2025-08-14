require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
//database
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//routes
const userroute = require('./routes/userroute');
const candidateroute = require('./routes/candidateroute');
const electiondatesrout = require('./routes/electiondateroute');
const notificationroute = require('./routes/notificationroute');
app.use('/user', userroute);
app.use('/candidate', candidateroute);
app.use('/election',electiondatesrout);
app.use('/notifications',notificationroute);

const port = 3000;
app.listen(port,()=>{
    console.log("server is roaring 🚀");
})


