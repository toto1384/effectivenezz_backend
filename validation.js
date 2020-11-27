const Joi = require('@hapi/joi');


//Activity VALIDATION
const activityValidation= (data)=>{
    const activitySchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        icon: Joi.number().required(),
        tags: Joi.array().items(Joi.string()).allow(null),
        color: Joi.string().required(),
        trackedStart: Joi.array().items(Joi.date()).allow(null),
        trackedEnd: Joi.array().items(Joi.date()).allow(null),
        parentId:Joi.number().allow(null),
        description:Joi.string().allow(null),
        value:Joi.number().allow(null),
        blacklistedDates:Joi.array().items(Joi.date()).allow(null),
        valueMultiply:Joi.number().allow(null),
        schedules:Joi.array().items(Joi.string()).allow(null)
    })

    return activitySchema.validate(data);
}

//CALENDAR VALIDATION

const calendarValidation= (data)=>{
    const calendarSchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        color: Joi.string().required(),
        description: Joi.string().allow(null),
        value:Joi.number().allow(null),
        valueMultiply:Joi.number().allow(null),
        show:Joi.boolean().allow(null)
    })

    return calendarSchema.validate(data);
}


//TASK VALIDATION
const taskValidation= (data)=>{
    const taskSchema = Joi.object({
        _id:Joi.string(),
        name: Joi.string().required(),
        checks: Joi.array().items(Joi.date()).allow(null),
        tags: Joi.array().items(Joi.string()).allow(null),
        color: Joi.string().required(),
        trackedStart: Joi.array().items(Joi.date()).allow(null),
        trackedEnd: Joi.array().items(Joi.date()).allow(null),
        parentId:Joi.number().allow(null),
        isParentCalendar: Joi.boolean().allow(null),
        description:Joi.string().allow(null),
        value:Joi.number().allow(null),
        blacklistedDates:Joi.array().items(Joi.date()).allow(null),
        valueMultiply:Joi.number().allow(null),
        schedules:Joi.array().items(Joi.string()).allow(null)
    })

    return taskSchema.validate(data);
}


//SCHEDULED VALIDATION

const scheduledValidation= (data)=>{
    const scheduledSchema = Joi.object({
        _id:Joi.string(),
        start: Joi.date().allow(null),
        duration: Joi.number().min(0).allow(null),
        repeatRule: Joi.number().allow(null),
        repeatValue: Joi.string().allow(null),
        repeatUntil: Joi.date().allow(null),
    })

    return scheduledSchema.validate(data);
}

//TAG VALIDATION
const tagValidation= (data)=>{
    const tagSchema = Joi.object({
        _id:Joi.string(),
        name:Joi.string().required(),
        color:Joi.string().required(),
        show: Joi.boolean().allow(null)
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