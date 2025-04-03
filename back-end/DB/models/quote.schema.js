import { Schema , model} from "mongoose";

const schema = new Schema({
    firstName : {type:String , required:true},
    lastName : {type:String , required:true},
    email : {type:String , required:true},
    phoneNumber : {type:String , required:true},
    eventDate : {type:Date , required:true},
    eventType : {type:String , required:true},
    deliveryAddress : {type:String , required:true},
    helpCustomer : {type:String , required:true},
    hearAboutUs : {type:String , required:true},
    
},{
    versionKey:false
})

export const Quote = model('Quote' , schema)