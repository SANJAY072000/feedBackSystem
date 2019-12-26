// importing the required modules
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const questSchema=new Schema({
    sevid:{
        type:Schema.Types.ObjectId,
        ref:'servicest'
    },
    questName:{
        type:String,
        required:true
    },
    avgRating:{
        type:Number,
        default:0
    },
    ratings:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'userst'
        },
        rating:{
            type:Number,
            default:0
        }
    }]
});


// exporting the schema
module.exports=mongoose.model('quest',questSchema);

