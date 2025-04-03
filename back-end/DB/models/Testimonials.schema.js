import { Schema, model } from "mongoose";

const schema = new Schema({
description : {type:String},
testimonals:[
    {
        Text:String ,
        authorName:String
    }
],
homeId:{type:Schema.Types.ObjectId , ref:'Home'}
},{
    versionKey:false
})

export const Testimonial = model('Testimonial' , schema)