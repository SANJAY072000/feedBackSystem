// importing the required modules
const express=require('express'),
router=express.Router(),
passport=require('passport');


// importing the schemas
const User=require('../../models/User'),
Admin=require('../../models/Admin'),
Service=require('../../models/Service'),
Quest=require('../../models/Quest');


/*
@type - GET
@route - /api/user/allServices
@desc - a route to get all the services for user
@access - PRIVATE
*/
router.get('/allServices',passport.authenticate('jwt',{session:false}),
(req,res)=>{
Service.find()
       .then(serv=>res.status(200).json(serv))
       .catch(err=>console.log(err)); 
});


/*
@type - GET
@route - /api/user/userService-:sid
@desc - a route to get all the questions for a particular service
@access - PRIVATE
*/
router.get('/userService-:sid',
passport.authenticate('jwt',{session:false}),
(req,res)=>{
Quest.find({sevid:req.params.sid})
     .sort({date:"asc"})
     .then(quest=>{
     if(!quest.length)
     return res.status(200).json({"noQuestions":"No questions found"});
     return res.status(200).json(quest)})
     .catch(err=>console.log(err));
});


/*
@type - POST
@route - /api/user/fillService-:sid
@desc - a route to submit feedback for a particular service
@access - PRIVATE
*/
router.post('/fillService-:sid',passport.authenticate('jwt',{session:false}
),(req,res)=>{
req.body.rating=req.body.rating.split(',').map(Number);
Quest.find({sevid:req.params.sid})
     .sort({date:"asc"})
     .then(quest=>{
     quest.forEach((a,i)=>{
     const rate={};
     a.trackSum+=req.body.rating[i];
     rate.user=req.user._id;
     rate.rating=req.body.rating[i];
     a.ratings.unshift(rate);
     a.avgRating=(a.trackSum/a.ratings.length).toFixed(2);
     a.save()
      .catch(err=>console.log(err));
    });
     })
     .catch(err=>console.log(err));
});


/*
@type - GET
@route - /api/user/upService-:sid
@desc - a route to update service average rating
@access - PRIVATE
*/
router.get('/upService-:sid',passport.authenticate('jwt',{session:false}),
(req,res)=>{
    Quest.find({sevid:req.params.sid})
    .then(quest=>{
    Service.findOne({_id:req.params.sid})
           .then(service=>{
           service.comments.unshift({
           user:req.user._id,
           text:req.body.text.toUpperCase()
           });
           let sum=0;
           quest.forEach(a=>{
           sum+=a.avgRating;
           });
           service.avgRating=(sum/quest.length).toFixed(2);
           service.save()
                  .then(service=>res.status(200).json(service))
                  .catch(err=>console.log(err));
           })
           .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});



// exporting the routes
module.exports=router;


