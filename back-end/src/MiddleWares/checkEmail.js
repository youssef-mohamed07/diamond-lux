import { User } from "../../DB/models/user.schema.js"
import { AppError } from "../utils/appError.js"



export const  checkEmail =async(req,res,next)=>{
    let user =await User.findOne({email : req.body.email})
    if(user) return next(new AppError('Email already exist ..',401))
next()
}