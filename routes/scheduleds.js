//ALL OPERATIONS NEED THE AUTH_TOKEN IN THE HEADERS


//ALL OF THESE OPERATIONS VERIFY THAT THE USER IS IN THE COMPANY, POST AND UPDATE JOI-TESTS EVERY TIME


const express = require('express');
const router = express.Router();
const Scheduled = require('../models/Scheduled')
const Task = require('../models/Task')
const Activity = require('../models/Activity');
const {scheduledValidation} = require('../validation');
const verifyToken = require('../verify_token');
const User = require('../models/User');

//GET ALL SCHEDULEDS BY EVENTID
//PARAMS : EVENT ID , COMPANY ID
//VERIFY USER IS IN COMPANY➡ FIND EVENT ➡ GET SCHEDULEDS FROM THE EVENT
router.get('/by/:event',verifyToken,async(req,res)=>{
    try{
        const activity = await Activity.findById(req.params.event)
        const task = await Task.findById(req.params.event)
        var schedulesIds = []
        if(activity)schedulesIds=activity.schedules
        if(task)schedulesIds=task.schedules
        if(schedulesIds){
            var schedules = await Scheduled.find({_id:{$in:schedulesIds}}).exec()
            res.json(schedules);
        }else res.json(null)
    }catch(err){
        res.json({error:err});
    }
});


//GET ALL SCHEDULEDS OF USER
//FIND SCHEDULES ➡ GET SCHEDULEDS FROM THE EVENT
router.get('/',verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user)
        const activities = await Activity.find({_id:{$in:user.activities}}).exec()
        const tasks = await Task.find({_id:{$in:user.tasks}}).exec()
        var schedulesIds = []
        if(activities)activities.forEach((element)=>{schedulesIds= schedulesIds.concat(element.schedules)})
        if(tasks)tasks.forEach((element)=>{schedulesIds= schedulesIds.concat(element.schedules)})
        if(schedulesIds){
            var schedules = await Scheduled.find({_id:{$in:schedulesIds}}).exec()
            res.json(schedules);
        }else res.json(null)
    }catch(err){
        res.json({error:err});
    }
});

//GET SCHEDULED BY ID
router.get('/:id',verifyToken,async(req,res)=>{
    try{
        const scheduled = await Scheduled.findById(req.params.id);
        res.json(scheduled);
    }catch(err){
        res.json({error:err});
    }
});


//DELETE A SCHEDULED BY EVENT ID
//PARAMS: COMPANY ID, SCHEDULED ID, EVENT ID
//VERIFY USER IS IN THE COMPANY ➡ SEARCH EVENT ➡ DELETE SCHEDULED FROM THE EVENT.SCHEDULEDS ➡ DELETE SCHEDULED
router.delete('/:id',verifyToken,async(req,res)=>{
    try{
        const removedScheduled = await Scheduled.findByIdAndDelete(req.params.id)
        await Activity.updateOne({schedules:{$in:removedScheduled._id}},{$pull:{schedules:req.params.id}})
        await Task.updateOne({schedules:{$in:removedScheduled._id}},{$pull:{schedules:req.params.id}})
        res.json(removedScheduled);
    }catch(err){
        res.json({error:err});
    }
});

//PATCH SCHEDULED
//PARAMS: NEW SCHEDULED, COMPANY ID
//VERIFY USER IS IN COMPANY ➡ UPDATE SCHEDULED
router.patch('/:id',verifyToken,async(req,res)=>{
    try{
        const {error} = scheduledValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const updatedScheduled = await Scheduled.updateOne
            ({_id:req.params.id},{
                start:req.body.start,
                duration:req.body.duration,
                repeatRule:req.body.repeatRule,
                repeatValue:req.body.repeatValue,
                repeatUntil:req.body.repeatUntil,
                blacklistedDates:req.body.blacklistedDates,
            });
        res.json(updatedScheduled);
    }catch(err){
        res.json({error:err});
    }
});


//POST SCHEDULED IN EVENT
//PARAMS: COMPANY ID, EVENT ID,  AND NEW SCHEDULED
//VERIFY USER IS IN COMPANY ➡ ADD NEW SCHEDULED TO DB ➡ SEARCH EVENT ➡ ADD THE SCHEDULED TO EVENT.SCHEDULEDS
router.post('/:event',verifyToken,async(req,res)=>{
    const {error} = scheduledValidation(req.body);
    if(error){
        return res.status(400).
            send(error.details[0].message);
    }

    const scheduled = new Scheduled({
        _id:req.body._id,
        start:req.body.start,
        duration:req.body.duration,
        repeatRule:req.body.repeatRule,
        repeatValue:req.body.repeatValue,
        repeatUntil:req.body.repeatUntil,
        blacklistedDates:req.body.blacklistedDates,
    });
    
    try{
        const savedScheduled = await scheduled.save()
        await Task.update({_id:req.params.event},{$push:{schedules:savedScheduled._id}})
        await Activity.update({_id:req.params.event},{$push:{schedules:savedScheduled._id}})
        res.status(200).json(savedScheduled)
    }catch(err){
        res.status(400).json({error:err})
    }
});

module.exports = router;