import mongoose, { Schema , model} from "mongoose";

const schema = new Schema({
    Name:[{
        firstName : {type:String , required:false},
        lastName : {type:String , required:false}
    }],
    email: { type: String, required: false, unique: false },
    phoneNumber : {type:String , required:false},
    address:[{
        country:String,
        Address_line1:String,
        Address_line2:String,
        city:String,
        state:String,
        zip_code:Number,
    }],
    Event_Date:Date ,
    Event_Type:Date ,
    Estimated_Guest_Count:Number,
    VenueName_and_Address : String,
    Additional_Information:String,
    Hear_About_Us : String,

    wishlist:{type:mongoose.Types.ObjectId,
        ref:'Wishlist'
     }
},{
    versionKey:false
})





export const User = model('User' , schema)