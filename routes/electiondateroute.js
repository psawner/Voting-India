const express = require('express');
const router = express.Router();
const elections = require('./../models/elections');
const user = require('./../models/user');
const notification = require('./../models/notification');
//middleware
const jwtauthmiddleware = require('./../middleware/jwt');

// function that checks admin
const checkadmin = async(userid)=>{
    try{
      const person = await user.findbyid(userid);
      return person[0]?.role === 'admin';
    }catch(err){
        return false;
    }
}

router.post('/dates',jwtauthmiddleware, async(req,res)=>{
    try{
        const userid = req.user.id;
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            res.status(403).json({error: "access denied"});
        }

        const {title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration} = req.body;
        await elections.creatingelectiondates(title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration);
        //notification
        const voters = await user.getvoters();
        for(const voter of voters){
            await notification.createnotification(voter.id, "📢 Election:", "Election dates announced");
        }
        res.status(200).json({message: "New election dates"});

    }catch(err){
        console.error(err);
        res.status(500).send("database error");
    }
})

router.get('/announcement/election/dates',jwtauthmiddleware,async(req,res)=>{
    try{
        const electiondates = await elections.showdates();
        res.status(200).json({elections: electiondates[0]});
    }catch(err){
        console.error(err);
        res.status(500).send("database error");
    }
})

router.put('/:dateid',jwtauthmiddleware,async(req,res)=>{
    try{

        const userid = req.user.id;
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: "access denied"});
        }
        const datesid = req.params.dateid;
        const ifexist = await elections.findingdatesbyid(datesid);

        if(!ifexist){
           return res.status(401).json({message: "not found"});
        }

        const {title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration} = req.body;
        await elections.updatedates(datesid,title,nomination_start,nomination_end,final_candidate_list,voting_start,voting_end,result_declaration);
        //notification
        const voters = await user.getvoters();
        for(const voter of voters){
            await notification.createnotification(voter.id, "📢 Election:", "Election dates have changed");
        }
        res.status(200).json({message: "Dates are changed successfully 🎉"});

    }catch(err){
        console.error(err);
        res.status(500).send("database error");
    }
})

router.delete('/:dateid',jwtauthmiddleware,async(req,res)=>{
    try{
        const userid = req.user.id;
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: "access denied"});
        }
        const datesid = req.params.dateid; 
        const ifexist = await elections.findingdatesbyid(datesid);

        if(!ifexist){
            return res.status(401).json({message: "not found"});
        }

        await elections.deletingdates(datesid);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.error(err);
        res.status(500).send("database error");
    }
})

module.exports = router;