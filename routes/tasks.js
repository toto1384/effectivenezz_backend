
//ALL OPERATIONS NEED THE AUTH_TOKEN IN THE HEADERS


//ALL OF THESE OPERATIONS VERIFY THAT THE USER IS IN THE COMPANY, POST AND UPDATE JOI-TESTS EVERY TIME


const express = require('express');
const router = express.Router();
const Task = require('../models/Task')
const Scheduled = require('../models/Scheduled')
const User = require('../models/User');
const {taskValidation} = require('../validation')
const verifyToken = require('../verify_token')
 
//GET ALL EVENTS BY COMPANYID
//PARAMS : COMPANY ID
//VERIFY USER IS IN COMPANY➡ FIND COMPANY ➡ GET EVENTS FROM THE COMPANY
router.get('/',verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user);
        const tasks = await Task.find({_id:{$in:user.tasks}}).exec()
        res.json(tasks);
    }catch(err){
        res.json({error:err});
    }
});


//GET EVENT BY ID
router.get('/:id',verifyToken,async(req,res)=>{
    try{
        const event = await Task.findById(req.params.id);
        res.json(event);
    }catch(err){
        res.json({error:err});
    }
});


//DELETE AN EVENT BY COMPANYID
//PARAMS: COMPANY ID AND EVENT ID
//VERIFY USER IS IN THE COMPANY ➡ SEARCH COMPANY ➡ DELETE EVENT FROM THE COMPANY.EVENTS ➡ DELETE EVENT
router.delete('/:id',verifyToken,async(req,res)=>{
    try{
        const removedEvent = await Task.findByIdAndDelete(req.params.id)
        await Scheduled.deleteMany({_id:{$in:removedEvent.schedules}})
        await User.updateOne({_id:req.user},{$pull:{tasks:removedEvent}})
        res.json(removedEvent);
    }catch(err){
        res.json({error:err});
    }
});

//PATCH EVENT
//PARAMS: NEW EVENT, COMPANY ID
//VERIFY USER IS IN COMPANY ➡ UPDATE EVENT
router.patch('/:id',verifyToken,async(req,res)=>{
    try{
        const {error} = taskValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const updatedEvent = await Task.updateOne
            ({_id:req.params.id},{
                name: req.body.name,
                checks:req.body.checks,
                tags:req.body.tags,
                color:req.body.color,
                trackedStart:req.body.trackedStart,
                trackedEnd:req.body.trackedEnd,
                parentId:req.body.parentId,
                isParentCalendar: req.body.isParentCalendar,
                description:req.body.description,
                value:req.body.value,
                blacklistedDates:req.body.blacklistedDates,
                valueMultiply:req.body.valueMultiply,
                scheduleds:req.body.scheduleds
            });
        res.json(updatedEvent);
    }catch(err){
        res.json({error:err});
    }
});


//POST EVENT BY COMPANY
//PARAMS: COMPANY ID AND NEW EVENT
//VERIFY USER IS IN COMPANY ➡ ADD NEW EVENT TO DB ➡ SEARCH COMPANY ➡ ADD THE EVENT TO COMPANY.EVENTS
router.post('/',verifyToken,async(req,res)=>{
    const {error} = taskValidation(req.body);
    if(error){
        return res.status(400).
            send(error.details[0].message);
    }

    const event = new Task({
        name: req.body.name,
        checks:req.body.checks,
        tags:req.body.tags,
        color:req.body.color,
        trackedStart:req.body.trackedStart,
        trackedEnd:req.body.trackedEnd,
        parentId:req.body.parentId,
        isParentCalendar: req.body.isParentCalendar,
        description:req.body.description,
        value:req.body.value,
        blacklistedDates:req.body.blacklistedDates,
        valueMultiply:req.body.valueMultiply,
        scheduleds:req.body.scheduleds
    });
    
    try{
        const savedEvent = await event.save()
        await User.update({_id:req.user},{$push:{tasks:savedEvent._id}})
        res.status(200).json(savedEvent)
    }catch(err){
        res.status(400).json({error:err})
    }
});

module.exports = router;