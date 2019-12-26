// importing the required modules
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    }
});


// exporting the schema
module.exports=mongoose.model('userst',userSchema);

