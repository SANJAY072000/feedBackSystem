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
    trackSum:{
        type:Number,
        default:0
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
    }],
    date:{
        type:Date,
        default:Date.now
    }
});


// exporting the schema
module.exports=mongoose.model('quest',questSchema);

