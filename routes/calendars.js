//ALL OPERATIONS NEED THE AUTH_TOKEN IN THE HEADERS
//POST AND UPDATE JOI-TESTS EVERY TIME


const express = require('express');
const router = express.Router();
const Calendar = require('../models/Calendar')
const User = require('../models/User');
const {calendarValidation} = require('../validation');
const verifyToken = require('../verify_token')
 
//GET ALL TAGS BY COMPANYID
//PARAMS : COMPANY ID
//VERIFY USER IS IN COMPANY➡ FIND COMPANY ➡ GET TAGS FROM THE COMPANY
router.get('/',verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user);
        const calendars = await Calendar.find({_id:{$in:user.calendars}}).exec()
        res.json(calendars);
    }catch(err){
        res.json({error:err});
    }
});


//GET TAG BY ID
router.get('/:id',verifyToken,async(req,res)=>{
    try{
        const tag = await Calendar.findById(req.params.id);
        res.json(tag);
    }catch(err){
        res.json({error:err});
    }
});


//DELETE AN TAG BY COMPANYID
//PARAMS: COMPANY ID AND TAG ID
//VERIFY USER IS IN THE COMPANY ➡ SEARCH COMPANY ➡ DELETE TAG FROM THE COMPANY.TAGS ➡ DELETE TAG
router.delete('/:id',verifyToken,async(req,res)=>{
    try{
        const removedCalendar = await Calendar.findByIdAndDelete(req.params.id)
        await User.updateOne({_id:req.user},{$pull:{calendars:req.params.id}})
        res.json(removedCalendar);
    }catch(err){
        res.json({error:err});
    }
});

//PATCH TAG
//PARAMS: NEW TAG, COMPANY ID
//VERIFY USER IS IN COMPANY ➡ UPDATE TAG
router.patch('/:id',verifyToken,async(req,res)=>{
    try{
        const {error} = calendarValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const updatedTag = await Calendar.updateOne
            ({_id:req.params.id},{
                name: req.body.name,
                color:req.body.color,
                description:req.body.description,
                value:req.body.value,
                valueMultiply:req.body.valueMultiply,
                show:req.body.show,
            });
        res.json(updatedTag);
    }catch(err){
        res.json({error:err});
    }
});


//POST TAG BY COMPANY
//PARAMS: COMPANY ID AND NEW TAG
//VERIFY USER IS IN COMPANY ➡ ADD NEW TAG TO DB ➡ SEARCH COMPANY ➡ ADD THE TAG TO COMPANY.TAGS
router.post('/',verifyToken,async(req,res)=>{
    const {error} = calendarValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const tag = new Calendar({
            name: req.body.name,
            color:req.body.color,
            description:req.body.description,
            value:req.body.value,
            valueMultiply:req.body.valueMultiply,
            show:req.body.show,
        });
        
        try{
            const savedTag = await tag.save()
            await User.update({_id:req.user},{$push:{calendars:savedTag._id}})
            res.status(200).json(savedTag)
        }catch(err){
            res.status(400).json({error:err})
        }
});

module.exports = router;