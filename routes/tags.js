//ALL OPERATIONS NEED THE AUTH_TOKEN IN THE HEADERS
//POST AND UPDATE JOI-TESTS EVERY TIME


const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag')
const User = require('../models/User');
const {tagValidation} = require('../validation');
const verifyToken = require('../verify_token')
 
//GET ALL TAGS BY COMPANYID
//PARAMS : COMPANY ID
//VERIFY USER IS IN COMPANY➡ FIND COMPANY ➡ GET TAGS FROM THE COMPANY
router.get('/',verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user);
        const tags = await Tag.findById({$in:user.tags})
        res.json(tags);
    }catch(err){
        res.json({error:err});
    }
});


//GET TAG BY ID
router.get('/:id',verifyToken,async(req,res)=>{
    try{
        const tag = await Tag.findById(req.params.id);
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
        const removedTag = await Tag.findByIdAndDelete(req.params.id)
        await User.updateOne({_id:req.user},{$pull:{tags:req.params.id}})
        res.json(removedTag);
    }catch(err){
        res.json({error:err});
    }
});

//PATCH TAG
//PARAMS: NEW TAG, COMPANY ID
//VERIFY USER IS IN COMPANY ➡ UPDATE TAG
router.patch('/:id',verifyToken,async(req,res)=>{
    try{
        const {error} = tagValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const updatedTag = await Tag.updateOne
            ({_id:req.params.id},{
                name: req.body.name,
                color:req.body.color,
                show:req.body.show
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
    const {error} = tagValidation(req.body);
    if(error){
        return res.status(400).
            send(error.details[0].message);
    }

    const tag = new Tag({
        name: req.body.name,
        color:req.body.color,
        show:req.body.show
    });
    
    try{
        const savedTag = await tag.save()
        await User.update({_id:req.user},{$push:{tags:savedTag._id}})
        res.status(200).json(savedTag)
    }catch(err){
        res.status(400).json({error:err})
    }
});

module.exports = router;