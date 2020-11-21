const jwt = require('jsonwebtoken')


module.exports = function (req,res,next){
    const token = req.header('auth-token');
    if(!token)return res.status(401).send('access denied');

    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET)
        if(!verified)req.status(400).send({message:'token is not valid'})
        req.user=verified;
        next();
    }catch(err){
        res.status(404).send('invalid token')
    }
}