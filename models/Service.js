// importing the required modules
const mongoose=require('mongoose'),
Schema=mongoose.Schema;


// creating the schema
const serviceSchema=new Schema({
    admid:{
        type:Schema.Types.ObjectId,
        ref:'adminst'
    },
    serviceName:{
        type:String,
        required:true
    },
    avgRating:{
        type:Number,
        default:0
    },
    comment:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'userst'
        },
        text:{
            type:String,
            required:true
        }
    }]
});


// exporting the schema
module.exports=mongoose.model('servicest',serviceSchema);

