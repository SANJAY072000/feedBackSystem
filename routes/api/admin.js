// importing the required modules
const express=require('express'),
router=express.Router(),
bcrypt=require('bcryptjs'),
passport=require('passport');


// importing the schemas
const User=require('../../models/User'),
Admin=require('../../models/Admin'),
Service=require('../../models/Service'),
Quest=require('../../models/Quest');


/*
@type - GET
@route - /api/admin/allServices
@desc - a route to get all the services
@access - PRIVATE
*/
router.get('/allServices',passport.authenticate('jwt',{session:false}),
(req,res)=>{
Service.find()
    .then(service=>{
    if(!service.length)
    return res.status(200).json({"noServices":"There are no services"});
    return res.status(200).json(service);
    })
       .catch(err=>console.log(err)); 
});


/*
@type - POST
@route - /api/admin/addServices
@desc - a route to add services
@access - PRIVATE
*/
router.post('/addServices',passport.authenticate('jwt',{session:false}),
(req,res)=>{
const name=req.body.name.toUpperCase(),
username=req.body.username.toUpperCase().trim(),
password=req.body.password.toUpperCase().trim();
Admin.findOne({username})
     .then(admin=>{
     if(admin){
    const newService={};
    newService.admid=admin._id;
    newService.serviceName=req.body.serviceName.toUpperCase();
    new Service(newService).save()
    .then(service=>res.status(200).json(service))
    .catch(err=>console.log(err));
     }
     else{
     const newAdmin=new Admin({name,username,password});
     bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(newAdmin.password,salt,(err, hash)=>{
        if(err)throw err;
        newAdmin.password=hash;
        newAdmin.save()
        .then(admin=>{
        const newService={};
        newService.admid=admin._id;
        newService.serviceName=req.body.serviceName.toUpperCase();
        new Service(newService).save()
        .then(service=>res.status(200).json(service))
        .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err)); 
        });
        });}
     })
     .catch(err=>console.log(err));
});


/*
@type - DELETE
@route - /api/admin/delServices-:sid
@desc - a route to delete particular services
@access - PRIVATE
*/
router.delete('/delServices-:sid',passport.authenticate('jwt',{session:false}),
(req,res)=>{
Service.findOne({_id:req.params.sid})
.then(service=>{
Admin.findOne({_id:service.admid})
     .then(admin=>{
     Service.find({admid:admin._id})
     .then(serv=>{
     if(serv.length==1){
     Admin.findOneAndRemove({_id:service.admid})
          .then(()=>{
          Service.findOneAndRemove({_id:req.params.sid})
          .then(()=>res.status(200).json({"removedSuccess":"Removed Successfully"}))
          .catch(err=>console.log(err));
          })
          .catch(err=>console.log(err));
     }
     else{
    Service.findOneAndRemove({_id:req.params.sid})
    .then(()=>res.status(200).json({"removedSuccess":"Removed Successfully"}))
    .catch(err=>console.log(err));
     }
     })
     .catch(err=>console.log(err));
     })
     .catch(err=>console.log(err));
})
.catch(err=>console.log(err));
});


/*
@type - GET
@route - /api/admin/allQuests-:sqid
@desc - a route to get all the questions of a service
@access - PRIVATE
*/
router.get('/allQuests-:sqid',passport.authenticate('jwt',{session:false}),
(req,res)=>{
Quest.find({sevid:req.params.sqid})
     .then(quest=>{
     if(!quest.length)return res.status(200).json({"noQuestions":"No questions found"});
     return res.status(200).json(quest);
     })
     .catch(err=>console.log(err));
});


/*
@type - POST
@route - /api/admin/addQuest-:sqid
@desc - a route to add the questions in a service
@access - PRIVATE
*/
router.post('/addQuest-:sqid',passport.authenticate('jwt',{session:false}),
(req,res)=>{
const newQuest={};
newQuest.sevid=req.params.sqid;
newQuest.questName=req.body.questName.toUpperCase();
new Quest(newQuest).save()
.then(quest=>res.status(200).json(quest))
.catch(err=>console.log(err));
});


/*
@type - DELETE
@route - /api/admin/delQuest-:qid
@desc - a route to delete the questions in a service
@access - PRIVATE
*/
router.delete('/delQuest-:qid',passport.authenticate('jwt',{session:false}
),(req,res)=>{
Quest.findOne({_id:req.params.qid})
     .then(question=>{
     Service.findOne({_id:question.sevid})
     .then(service=>{
     Quest.find({sevid:service._id})
     .then(quest=>{
     let l=quest.length;
     service.avgRating=
    ((Math.ceil(service.avgRating*l)-question.avgRating)/(l-1)).toFixed(2);
     service.save()
     .then(service=>{
     Quest.findOneAndRemove({_id:req.params.qid})
     .then(()=>res.status(200).json({"questionRemoved":"Removed Successfully"}))
     .catch(err=>console.log(err));
     })
     .catch(err=>console.log(err));  
     })
     .catch(err=>console.log(err));
     })
     .catch(err=>console.log(err));
     })
     .catch(err=>console.log(err));
});


/*
@type - GET
@route - /api/admin/
@desc - a route to get all the services for a non-master admin
@access - PRIVATE
*/
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
Service.find({admid:req.user._id})
.then(serv=>res.status(200).json(serv))
.catch(err=>console.log(err));
});


/*
@type - GET
@route - /api/admin/nmService-:sid
@desc - a route to get the ratings for a non-master admin
@access - PRIVATE
*/
router.get('/nmService-:sid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Service.findOne({_id:req.params.sid})
    .then(service=>{
    Quest.find({sevid:req.params.sid})
    .then(quest=>res.status(200).json({
    savr:service.avgRating,
    quest:quest
    }))
    .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
    });






// exporting the routes
module.exports=router;






