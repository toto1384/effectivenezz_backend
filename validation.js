const Joi = require('@hapi/joi');


//Activity VALIDATION
const activityValidation= (data)=>{
    const activitySchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        icon: Joi.number().required(),
        tags: Joi.array().items(Joi.string()),
        color: Joi.string().required(),
        trackedStart: Joi.array().items(Joi.date()),
        trackedEnd: Joi.array().items(Joi.date()),
        parentId:Joi.number(),
        description:Joi.string(),
        value:Joi.number(),
        blacklistedDates:Joi.array().items(Joi.date()),
        valueMultiply:Joi.number(),
        schedules:Joi.array().items(Joi.string())
    })

    return activitySchema.validate(data);
}

//CALENDAR VALIDATION

const calendarValidation= (data)=>{
    const calendarSchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        color: Joi.string().required(),
        description: Joi.string(),
        value:Joi.number(),
        valueMultiply:Joi.number(),
        show:Joi.boolean()
    })

    return calendarSchema.validate(data);
}


//TASK VALIDATION
const taskValidation= (data)=>{
    const taskSchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        checks: Joi.array().items(Joi.date()),
        tags: Joi.array().items(Joi.string()),
        color: Joi.string().required(),
        trackedStart: Joi.array().items(Joi.date()),
        trackedEnd: Joi.array().items(Joi.date()),
        parentId:Joi.number(),
        isParentCalendar: Joi.boolean(),
        description:Joi.string(),
        value:Joi.number(),
        blacklistedDates:Joi.array().items(Joi.date()),
        valueMultiply:Joi.number(),
        schedules:Joi.array().items(Joi.string())
    })

    return taskSchema.validate(data);
}


//SCHEDULED VALIDATION

const scheduledValidation= (data)=>{
    const scheduledSchema = Joi.object({
        _id:Joi.string(),
        start: Joi.date(),
        duration: Joi.number().min(0),
        repeatRule: Joi.number(),
        repeatValue: Joi.string(),
        repeatUntil: Joi.date(),
    })

    return scheduledSchema.validate(data);
}

//TAG VALIDATION
const tagValidation= (data)=>{
    const tagSchema = Joi.object({
        _id:Joi.string(),
        name:Joi.string().required(),
        color:Joi.string().required(),
        show: Joi.boolean()
    })

    return tagSchema.validate(data);
}
 
//LOGIN VALIDATION
const loginValidation= (data)=>{
    const userSchema = Joi.object({
        googleId: Joi.string().required(),
        email: Joi.string().email().required(),
    })

    return userSchema.validate(data);

}


//REGISTER VALIDATION
const registerOrUpdateUserValidation= (data)=>{
    const userSchema = Joi.object({
        googleId: Joi.string().required(),
        email: Joi.string().email().required(),
        tags: Joi.array().items(Joi.string()),
        calendars: Joi.array().items(Joi.string()),
        tasks: Joi.array().items(Joi.string()),
        activities: Joi.array().items(Joi.string()),
    })

    return userSchema.validate(data);
}



module.exports.activityValidation = activityValidation
module.exports.taskValidation = taskValidation
module.exports.calendarValidation = calendarValidation
module.exports.scheduledValidation = scheduledValidation
module.exports.tagValidation = tagValidation

module.exports.loginValidation = loginValidation
module.exports.registerOrUpdateUserValidation = registerOrUpdateUserValidation