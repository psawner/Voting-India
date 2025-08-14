const express = require('express');
const router = express.Router();
const candidate = require('./../models/candidate');
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

//to add candidates data
router.post('/', jwtauthmiddleware, async (req,res)=>{
    const userid = req.user.id;
    try{
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: 'access denied'});
        }
        const {name, party, age} = req.body;
        await candidate.createcandidates(name,party,age,0,0);

        //notification for voters
        const voters = await user.getvoters();
        for(const voter of voters){
            await notification.createnotification(voter.id, "New Aspirant", "New Candidate is added to the list")
        }

        res.status(200).json({message: 'candidate added successfully 🎉'})
    }catch(err){
        console.error('Error adding candidate:', err);
        res.status(500).json({ error: 'Database error' });
    }
})

//to show candidates detail
router.get('/profile',jwtauthmiddleware, async(req,res)=>{
    const userid = req.user.id;
    try{
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: 'access denied'});
        }

        const candidatedata = await candidate.showcandidates();
        res.status(200).json({candidates: candidatedata});

    }catch(err){
        console.error('Error adding candidate:', err);
        res.status(500).json({ error: 'Database error' });
    }
})

// fetching candidate name and party
router.get('/candidatelist',jwtauthmiddleware, async(req,res)=>{
   try{
        const candidatedata = await candidate.showcandidates();
        res.status(200).json({candidates: candidatedata});
   }catch(err){
       console.error('Error adding candidate:', err);
       res.status(500).json({ error: 'Database error' });
   }
})

//to update candidate data
router.put('/:candidateid', jwtauthmiddleware, async (req,res)=>{
    const userid = req.user.id;
    try{
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: 'access denied'});
        }

        const candidateid = req.params.candidateid;
        const candidateexist = await candidate.findbycandidateid(candidateid);

        if(!candidateexist){
            return res.status(404).json({error: 'not found 😒'});
        }

        const {name,party,age} = req.body;
        await candidate.updatecandidate(candidateid,name,party,age);
        res.status(200).json({message: 'candidate updated successfully 🎉'});
      

    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})
 

//to delete candidate data
router.delete('/:candidateid', jwtauthmiddleware, async (req,res)=>{

    const userid = req.user.id;
    try{
        const isadmin = await checkadmin(userid);
        if(!isadmin){
            return res.status(403).json({error: 'access denied'});
        }
        const candidateid = req.params.candidateid;
        const candidateexist = await candidate.findbycandidateid(candidateid);

        if(!candidateexist){
            return res.status(404).json({error: 'not found 😒'});
        }

        await candidate.deletecandidate(candidateid);
        res.status(200).json({message: 'successfully deleted 🗑️'});
    }catch(err){
      console.error(err);
      res.status(500).send('database error');
    }
})


//voting route
router.post('/vote/:candidateid',jwtauthmiddleware, async(req,res)=>{

    //no admin can vote
    //user can vote once

    const candidateid = req.params.candidateid;
    const userid = req.user.id;

    try{
        
        const candidateexist = await candidate.findbycandidateid(candidateid );
        if(!candidateexist){
            return res.status(404).json({error: 'candidate not found 😒'});
        }
        const person = await user.findbyid(userid);
        if(!person){
            return res.status(404).json({error: 'user not found 😒'});
        }
        if(person[0].role == "admin"){
            return res.status(403).json({message: 'admin is not allowed'});
        }

        if(person[0].isvoted){
            return res.status(400).json({message: 'you have already voted'});
        }

        //top candidate before voting
        const beforeVoteList = await candidate.getallcandidatesbyvotecount();
        const topBefore = beforeVoteList[0];
     // who votes to whom
        await candidate.recordvote(userid,candidateid);
     //update candidates votecount 
        await candidate.incrementvote(candidateid);
     //update users isvoted flag
        await user.updateisvoted(userid);

        await notification.createnotification(
            userid,
            "🗳️ Vote Status: ",
            "You casted your vote! Thank you"
        );

        const voters = await user.getvoters();
        for(const voter of voters){
            await notification.createnotification(
                voter.id,
                "📢 Vote Count: ",
                `${candidateexist.name} gains a vote and counting..`
            );
        }
        
        //top candidate after voting
        const afterVoteList = await candidate.getallcandidatesbyvotecount();
        const topAfter = afterVoteList[0];
        if(topBefore.name!==topAfter.name){
            await notification.createnotification(
                userid,
                `Leaderboard Update: (${topAfter.name})`,
                "Now he is the new leading candidate"
            )
        }

        res.status(200).json({message: 'vote cast successfully'});

    }catch(err){
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You have already voted (DB constraint)' });
        }
        console.error(err);
        res.status(500).send('database error');
    }
})


//vote count
router.get('/vote/count', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

//pie chart
router.get('/vote/count/piechart', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

//graph
router.get('/vote/count/graph', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

//shwoing graph on dashboard
router.get('/vote/dashboard/graph', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

//prediction 
router.get('/vote/count/predict', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})


//candidate list 
router.get('/candidate-list',jwtauthmiddleware, async (req,res)=>{

    try{
        const candidate_list = await candidate.showcandidates();
        res.status(200).json({candidate_list});

    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

router.get('/vote/topcandidates', jwtauthmiddleware, async (req,res)=>{

    try{
        const result = await candidate.getallcandidatesbyvotecount();
        res.status(200).json({candidates: result});
    }catch(err){
        console.error(err);
        res.status(500).send('database error');
    }
})

//top candidate list


module.exports = router;