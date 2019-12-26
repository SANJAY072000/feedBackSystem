// importing the required modules
const express=require('express'),
router=express.Router(),
mongoose=require('mongoose'),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken'),
passport=require('passport');


// importing the schemas
const User=require('../../models/User');


/*
@type - POST
@route - /api/auth/registerUser
@desc - a route to register user
@access - PUBLIC
*/
router.post('/registerUser',(req,res)=>{
const username=req.body.username.trim(),password=req.body.password.trim(),
domain=req.body.domain;
User.findOne({username})
    .then(user=>{
    if(!user)return res.status(200).json({"notRegistered":"User is not registered"});
    const newUser=new User({username,password,domain});
    bcrypt.genSalt(10,(err, salt)=>{
    bcrypt.hash(newUser.password,salt,(err, hash)=>{
    if(err)throw err;
    newUser.password=hash;
    newUser.save()
           .then(user=>res.status(200).json(user))
           .catch(err=>console.log(err)); 
    });
    });
    })
    .catch(err=>console.log(err));
});






// exporting the routes
module.exports=router;






