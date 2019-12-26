// importing the required modules
const express=require('express'),
router=express.Router(),
mongoose=require('mongoose'),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken'),
passport=require('passport');


// importing the schemas
const User=require('../../models/User');


// importing the configuration key
const key=require('../../setup/config');


/*
@type - POST
@route - /api/auth/registerUser
@desc - a route to register user
@access - PUBLIC
*/
router.post('/registerUser',(req,res)=>{
const username=req.body.username.toUpperCase().trim(),password=req.body.password.toUpperCase().trim(),
domain=req.body.domain.toUpperCase();
User.findOne({username})
    .then(user=>{
    if(user)return res.status(200).json({"alreadyRegistered":"User is already registered"});
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


/*
@type - POST
@route - /api/auth/loginUser
@desc - a route to login user
@access - PUBLIC
*/
router.post('/loginUser',(req,res)=>{
const username=req.body.username.toUpperCase().trim(),password=req.body.password.toUpperCase().trim(),
domain=req.body.domain.toUpperCase();
User.findOne({username})
    .then(user=>{
    if(!user)return res.status(200).json({"notRegistered":"User is not registered"});
    bcrypt.compare(password,user.password)
          .then(isCorrect=>{
          if(isCorrect){
          const payload={
              id:user._id,
              username:user.username,
              domain:user.domain
          };
          jsonwt.sign(payload,key.secret,{expiresIn:3600},
          (err,token)=>{
          if(err)throw err;
          return res.status(200).json({
          success:true,
          token:`Bearer ${token}`
          });
          });  
          }  
          else return res.status(200).json({"incorrectPassword":"Password is incorrect"});
          })
          .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});




// exporting the routes
module.exports=router;






