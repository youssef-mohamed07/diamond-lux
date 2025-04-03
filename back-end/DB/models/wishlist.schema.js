import mongoose, {Schema,model} from "mongoose";

const schema=new Schema({
userId: { type: String, required: true, unique: true },
user:{type:mongoose.Types.ObjectId, ref:'User',},
wishlistItems:[
    {
        product:{type:mongoose.Types.ObjectId, ref:'Product',required:true},
        quantity:{type:Number , default:1},
        price:Number
    }
],
totalWishlistprice:Number,

},{
    timestamps:false,
    versionKey:false
})


export const Wishlist= model('Wishlist',schema)