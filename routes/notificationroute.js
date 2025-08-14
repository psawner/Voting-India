const express = require('express');
const router = express.Router();
const user = require('./../models/user');
const notification = require('./../models/notification');


//token based authentication
const jwtauthmiddleware= require('./../middleware/jwt');

router.get('/notification', jwtauthmiddleware, async(req,res)=>{
    try{
        const useridentity = req.user.id;
        const notifications = await notification.getnotification(useridentity);
        res.status(200).json({notifications});

    }catch(err){
       res.status(500).json({ error: 'Something went wrong.' });
    }
})

//notification as read route
router.put('/read',jwtauthmiddleware,async(req,res)=>{
    try{
        const {notificationid} = req.body;
        if (!notificationid) {
            return res.status(400).json({ error: 'Notification ID required' });
        }
        const result = await notification.markasread(notificationid);
        res.status(200).json({success: true,result});
    }catch(err){
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
})

module.exports = router;
