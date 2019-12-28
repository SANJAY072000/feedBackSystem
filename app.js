// importing the required modules
const express=require("express"),
passport=require("passport"),
bodyparser=require("body-parser"),
mongoose=require('mongoose'),
path=require("path"),
cors=require("cors");


// creating the server
const app=express();


// importing the routes
const auth=require('./routes/api/auth'),
admin=require('./routes/api/admin'),
user=require('./routes/api/user');


// importing the database connection string
const dbstr=require('./setup/config').mongoUrl;


// connecting the database
mongoose.connect(dbstr,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>console.log('Mongodb connected successfully'))
        .catch(err=>console.log(err));


// configuring middleware for bodyparser
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


// configuring middleware for cors
app.use(cors());


// configuring middleware for passport
app.use(passport.initialize());


// importing the strategy
// require('./strategies/jwtStrategyAdmin')(passport);
require('./strategies/jsonwtStrategy')(passport);
require('./strategies/jwtStrategyAdmin')(passport);


// declaring the port
const port=process.env.PORT || 3000;


// configuring the routes
app.use('/api/auth',auth);
app.use('/api/admin',admin);
app.use('/api/user',user);


// deployment related stuff
if(process.env.NODE_ENV==="production"){
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}


// starting the server
app.listen(port,()=>console.log(`Server is running at port ${port}`));
















