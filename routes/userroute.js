const express = require('express');
const router = express.Router();
const user = require('./../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const notification = require('./../models/notification');


//token based authentication
const jwt = require('jsonwebtoken');
const jwt_key= process.env.JWT_KEY;
const jwtauthmiddleware= require('./../middleware/jwt');



// it receives data from frontend and send to database to save data using 'post'
router.post('/signup',async (req,res)=>{
    const {name, email, age, mobile, address, aadharCardNumber, password, role, isvoted} = req.body;

    const defaultAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;


    try{

      if(role === 'admin'){
        const adminalreadyexists = await user.adminexist();
        if(adminalreadyexists){
          return res.status(403).json({message: 'only an admin is allowed'});
        }
      }
      const ifexist = await user.ifexist(name,email);
      if(ifexist){
        return res.status(409).send('user already exist');
      }
      const hashpassword = await bcrypt.hash(password,10);
      const person = await user.createuser(name, email, age, mobile, address, aadharCardNumber, hashpassword, role, isvoted,null,defaultAvatar);
       // Create JWT Token
      const token = jwt.sign(
          { id: person.id, name: person.name, email: person.email },
          jwt_key,
          { expiresIn: "24h" }
      );
      await notification.createnotification(person.id, "Welcome 🎉", "Thanks for being a member of this community");
    
      res.status(200).json({message: 'user registered successfully', token});
  
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})



router.post('/signin', async (req,res)=>{
  const {email, password} = req.body;

  try{

    const person = await user.findbyemail(email);
    if(!person){
      return res.status(404).send('user not found 😔');
    }

    const passwordmatch = await bcrypt.compare(password, person.password);
    if(!passwordmatch){
      return res.status(401).send('inccorrect password ❌');
    }

    //token creation
    const token = jwt.sign(
      { id: person.id, name: person.name, email: person.email},
      jwt_key,{expiresIn: "24h"}
    )
    
    res.json({message: 'login successful',token});

  }catch(err){
    console.error(err);
      res.status(500).send('database error');
  }
})


router.get('/profile', jwtauthmiddleware, async (req,res)=>{
  try{

    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    //console.log("User fetched by ID:", person);
    res.status(200).json({person});


  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})
//fetching user name and email
router.get('/profile/info',jwtauthmiddleware, async (req,res)=>{
  try{
    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    const result = person[0];

    const {name,email} = result;
    //console.log("User fetched by ID:",result);
    res.status(200).json({person: {name,email}});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//fetching user name only
router.get('/profile/name',jwtauthmiddleware, async (req,res)=>{
  try{
    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    const result = person[0];

    const {name} = result;
    //console.log("User fetched by ID:",result);
    res.status(200).json({person: {name}});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//fetching personal details
router.get('/profile/personalinfo',jwtauthmiddleware, async (req,res)=>{
  try{
    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    const result = person[0];

    const {name, email, age, mobile, address, aadharCardNumber, role} = result;
    //console.log("User fetched by ID:",result);
    res.status(200).json({person: {name, email, age, mobile, address, aadharCardNumber, role}});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//email verify route
router.post('/profile/verify-email', jwtauthmiddleware, async(req,res)=>{
  const {email} = req.body;
  const userid = req.user.id;
  try{
    const person = await user.findbyid(userid);
    if(!person || person[0].email !== email){
      return res.status(400).json({success: false, message: "email does not exist"});
    }
    res.status(200).json({success: true, message: "email verified"});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//email verification and generating otp
router.post('/profile/verify-otp', jwtauthmiddleware, async(req,res)=>{
  const {email} = req.body;
  const userid = req.user.id;
  try{
    const person = await user.findbyid(userid);
    if(!person || person[0].email !== email){
      return res.status(400).json({success: false, message: "email does not exist"});
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await user.saveverifycode(userid,otp);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #ddd;">
            <h2 style="color: #4CAF50;">Email Verification</h2>
            <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 10px 0; padding: 10px; background-color: #f0f8ff; border: 1px solid #4CAF50; display: inline-block;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #555;">This code is valid for 5 minutes.</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: right;">Thank you,<br>Team VotingIndia</p>
            <p style="font-size: 12px; color: #888;">If you did not request this code, please ignore this email.</p>
          </div>
        </div>
      `
    });
    res.status(200).json({success: true, message: "otp sent to email"});
  }catch(err){
    console.error(err);
    res.status(500).json({ success: false, message: "database error" })
  }
})

// otp verification route
router.post('/profile/confirm-otp', jwtauthmiddleware, async(req,res)=>{
  const {email,otp} = req.body;
  const userid = req.user.id;
  try{
    const person = await user.findbyid(userid);
    if(!person || person[0].email !== email){
      return res.status(400).json({success: false, message: "email does not exist"});
    }
    if (String(person[0].emailOtp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }

    if (person[0].otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    await user.markverified(userid);
    res.status(200).json({success: true, message: "email verified successfully"});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//for updating some info in frontend , to get that updated things we use "put or patch"
router.put('/profile/password', jwtauthmiddleware, async (req,res)=>{

  const userid = req.user.id;
  const {currentpassword, newpassword} = req.body;

  try{
    const personauth = await user.findbyid(userid);

    if(!personauth){
      return res.status(404).send('person not found');
    }
    const storeuser = personauth[0];
    const ismatch = await bcrypt.compare(currentpassword,storeuser.password);

    if(!ismatch){
        return res.status(401).json({message: 'current password is incoorect'});
    }
    const hashnewpassword = await bcrypt.hash(newpassword,10);
    await user.updatedid(userid,hashnewpassword);
    await notification.createnotification(
      userid,
      "🔐 Security: ",
      "You updated your password"
  );
    res.status(200).json({ success: true, message: 'Data updated Successfully 😊' });

  }catch(err){
    console.error('Error updating password:', err.message);
    res.status(500).json({ error: err.message });

  }
})

//creating new password when user forget password
router.post('/create/password',jwtauthmiddleware, async(req,res)=>{
  const userid = req.user.id;
  const {newpassword} = req.body;
  try{
    const personauth = await user.findbyid(userid);

    if(!personauth){
      return res.status(404).send('person not found');
    }

    const hashnewpassword = await bcrypt.hash(newpassword,10);
    await user.updatedid(userid,hashnewpassword);
    await notification.createnotification(
      userid,
      "🔐 Security: ",
      "You changed your password"
    );
    res.status(200).json({ success: true, message: 'Data updated Successfully 😊' });

  }catch(err){
    console.error('Error changed password:', err.message);
    res.status(500).json({ error: err.message });

  }
})

//showing current status of voting
router.get('/current/votestatus', jwtauthmiddleware, async (req,res)=>{
  try{

    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    const result = person[0];

    const {isvoted} =result;
    //console.log("User fetched by ID:", person);
    res.status(200).json({person: {isvoted}});


  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})
//profile image loading route by default
router.get('/profileimage',jwtauthmiddleware, async(req,res)=>{
    const userdata = req.user;
    const userid = userdata.id;
    const person = await user.findbyid(userid);
    res.status(200).json(person[0]);
})
//notification status
router.put('/profile/notifications/status',jwtauthmiddleware, async(req,res)=>{
  const userid = req.user.id;
  const {notifications} = req.body;
  try{
    await user.notificationstatus(notifications,userid);
    res.status(200).json({success:true});
  }catch(err){
    console.error(err);
    res.status(500).send('database error');
  }
})

//logout route
router.post('/signout',(req,res)=>{
  res.json({message:'logout successful'});
})


module.exports = router;

