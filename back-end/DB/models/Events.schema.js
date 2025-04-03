import { Schema, model } from "mongoose";

const schema = new Schema({
title : {type:String},
event:[
    {
        description:String ,
        image:String
    }
]
},{
    versionKey:false
})

export const Event = model('Event' , schema)