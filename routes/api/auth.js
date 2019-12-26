// importing the required modules
const express=require('express'),
router=express.Router(),
bcrypt=require('bcryptjs'),
jsonwt=require('jsonwebtoken'),
passport=require('passport');


// importing the schemas
const User=require('../../models/User'),
Admin=require('../../models/Admin');


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
const username=req.body.username.toUpperCase().trim(),password=req.body.password.toUpperCase().trim();
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


/*
@type - GET
@route - /api/auth/testUser
@desc - a route to test login of the user
@access - PRIVATE
*/
router.get('/testUser',passport.authenticate('jwt',{session:false}),
(req,res)=>{
return res.status(200).json({"loginSuccess":"User Login is successful"});
});


/*
@type - POST
@route - /api/auth/registerAdmin
@desc - a route to register admin
@access - PUBLIC
*/
router.post('/registerAdmin',(req,res)=>{
    const username=req.body.username.toUpperCase().trim(),password=req.body.password.toUpperCase().trim(),
    name=req.body.name.toUpperCase();
    Admin.findOne({username})
        .then(admin=>{
        if(admin)return res.status(200).json({"alreadyRegistered":"Admin is already registered"});
        const newAdmin=new Admin({username,password,name});
        bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(newAdmin.password,salt,(err, hash)=>{
        if(err)throw err;
        newAdmin.password=hash;
        newAdmin.save()
               .then(admin=>res.status(200).json(admin))
               .catch(err=>console.log(err)); 
        });
        });
        })
        .catch(err=>console.log(err));
    });


/*
@type - POST
@route - /api/auth/loginAdmin
@desc - a route to login admin
@access - PUBLIC
*/
router.post('/loginAdmin',(req,res)=>{
    const username=req.body.username.toUpperCase().trim(),password=req.body.password.toUpperCase().trim();
    Admin.findOne({username})
        .then(admin=>{
        if(!admin)return res.status(200).json({"notRegistered":"Admin is not registered"});
        bcrypt.compare(password,admin.password)
              .then(isCorrect=>{
              if(isCorrect){
              const payload={
                  id:admin._id,
                  username:admin.username,
                  name:admin.name
              };
              jsonwt.sign(payload,key.secret,{expiresIn:3600},
              (err,token)=>{
              if(err)throw err;
              else if(admin.name=='MASTER')
              return res.status(200).json({
              success:true,
              name:'MASTER',
              token:`Bearer ${token}`
              });
              else return res.status(200).json({
                success:true,
                name:'NOTMASTER',
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


/*
@type - GET
@route - /api/auth/testAdmin
@desc - a route to test login of the admin
@access - PRIVATE
*/
router.get('/testAdmin',passport.authenticate('jwt',{session:false}),
(req,res)=>{
return res.status(200).json({"loginSuccess":"Admin Login is successful"});
});




// exporting the routes
module.exports=router;






