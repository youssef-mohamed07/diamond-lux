import mongoose, {Schema,model} from "mongoose";

const schema=new Schema({
    intro:{type:String,required:true},
    journey:{type:String,required:true},
    mission:{type:String,required:true},
    whyChoose:[
        {
            title:{type:String,required:true},
            text:{type:String,required:true},
        }
    ],
    image:{type: String, required: true}
},{
    timestamps:false,
    versionKey:false
})


export const AboutUs= model('AboutUs',schema)