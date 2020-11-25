const express = require('express');
const User = require('../models/User');
const {registerOrUpdateUserValidation,loginValidation,}=require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const argv = require('optimist').argv;

const Activity = require('../models/Activity')
const Calendar = require('../models/Calendar')
const Scheduled = require('../models/Scheduled')
const Tag = require('../models/Tag')
const Task = require('../models/Task')
const verifyToken = require('../verify_token')

const router = express.Router();

//LOGIN OR REGISTERING
//PARAMS: EMAIL AND GOOGLEID
//CHECKS IF USER EXISTS, IF EXISTS, IT LOGS IN AND PROVIDES THE AUTH_TOKEN IN THE HEADERS IF IT MATCHES THE EMAIL
//IF IT DOESN'T EXISTS IT CREATES THE USER WITH THE HASHED GOOGLEID AND THE PROFILE PIC AND NAME FROM GOOGLE APIS
router.get('/login',async (req,res)=>{

    //email checking
    User.findOne({email:req.body.email},async(err,user)=>{
        if(user){
            //login
    
            //joi checking
            const {error} = loginValidation(req.body);
            if(error){
                return res.status(400).
                    send(error.details[0].message);
            }
    
            const validId = await bcrypt.compare(req.body.googleId,user.googleId);
            if(!validId) return res.status(400).send('googleId does not match the email')
    
            const token = jwt.sign({_id:user._id},argv.secret)
    
            res.status(200).send(token)
        }else{
            //create new user
    
            //joi checking
            const {error} = registerOrUpdateUserValidation(req.body);
            if(error){
                return res.status(400).
                    send(error.details[0].message);
            }
    
            //hash the google id
            const salt = await bcrypt.genSalt(10);
            const hashedGoogleId = await bcrypt.hash(req.body.googleId,salt);
    
            //creating the user
            const user = new User({
                email: req.body.email,
                googleId: hashedGoogleId,
            });
            
            user.save().then(data=>{
                const token = jwt.sign({_id:data._id},process.env.TOKEN_SECRET)
    
                res.status(200).send(token)
            }).catch(err=>res.status(400).send(err));
    
        }
    });
});


//DELETE AN USER
//PARAMS: COMPANY ID AND USER ID
//VERIFY USER IS IN THE COMPANY ➡ SEARCH COMPANY ➡ DELETE FILE FROM THE COMPANY.FILES ➡ DELETE FILE ➡ DELETE FILE
//FROM FILEHOSTER
router.delete('/',verifyToken,async(req,res)=>{
    try{
        const removedUser = await User.findByIdAndDelete(req.user)
        //delete tasks and activities and calendars and tags and scheduleds 
        if(!removedUser)return res.status(404).send({message:'user does not exist'})
        await Tag.deleteMany({_id:{$in:removedUser.tags}})
        await Calendar.deleteMany({_id:{$in:removedUser.calendars}})
        const tasks = await Task.find({_id:{$in:removedUser.tasks}}).exec()
        const activities = await Activity.find({_id:{$in:removedUser.activities}}).exec()
        if(tasks)tasks.forEach(async(item)=>{
            await Scheduled.deleteMany({_id:{$in:item.schedules}})
            await Task.findByIdAndDelete(item._id)
        });
        if(activities)activities.forEach(async(item)=>{
            await Scheduled.deleteMany({_id:{$in:item.schedules}})
            await Activity.findByIdAndDelete(item._id)
        });

        res.json(removedUser);
    }catch(err){
        res.json({error:err});
    }
});

//PATCH USER
//PARAMS: NEW USER,
//UPDATE USER IN DB
router.patch('/',verifyToken,async(req,res)=>{
    try{
        const {error} = registerOrUpdateUserValidation(req.body);
        if(error){
            return res.status(400).
                send(error.details[0].message);
        }

        const updatedUser = await User.updateOne
            ({_id:req.user},{
                name: res.name,
                email: req.body.email,
                tags:req.body.tags,
                calendars:req.body.calendars,
                tasks:req.body.tasks,
                activities:req.body.activities,
            });

        res.json(updatedUser);
    }catch(err){
        res.json({error:err});
    }
});


module.exports = router;