import {User} from '../../../DB/models/user.schema.js'
import { catchError } from "../../MiddleWares/CatchError.js"
import { AppError } from "../../utils/appError.js"

const AddUsers=catchError(  async(req,res,next)=>{
const user=new User(req.body)
await user.save()
res.status(201).json({message:"Created..",user})
})

const getUsers =catchError( async(req,res)=>{
    const user =await User.find()
    res.status(200).json({message:"All Users:..",user})
})

const getUser =catchError(async(req,res,next)=>{
    const user =await User.findById(req.params.id)
    user || next(new AppError('User Not Found',404))
    !user || res.status(200).json({message:" User:..",user})
})


const updateUsers =catchError(async(req,res,next)=>{
    const Users =await User.findByIdAndUpdate(req.params.id ,req.body,{new:true})
    Users || next(new AppError('Users Not Found',404))
    !Users || res.status(200).json({message:" Updated:..",Users})
})




const deleteUsers =catchError(async(req,res,next)=>{
    const Users =await User.findByIdAndDelete(req.params.id,{new:true})
    Users || next(new AppError('Users Not Found',404))
    !Users || res.status(200).json({message:" Deleted:..",Users})
})

export {
    AddUsers, deleteUsers, getUser, getUsers, updateUsers
}
