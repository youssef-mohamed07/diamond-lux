
import { Category } from "../../../DB/models/Category.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"



const AddCategory =catchError( async(req,res,next)=>{
    // req.body.image=req.file.filename
    const category = await Category.insertMany(req.body)
    res.status(200).json({messae:'Add Successfully..' , category})
})

const getAllCategory =catchError( async(req,res,next)=>{
    const categories = await Category.find()
    res.status(200).json({messae:'Success..' , categories})
})

const updateCategory =catchError( async(req,res,next)=>{
    req.body.image=req.file.filename
    const category = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json({messae:'Success..' , category})
})

const deleteCategory =catchError( async(req,res,next)=>{
    const category = await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({messae:'Success..' , category})
})


const getCategoryById =catchError( async(req,res,next)=>{   
    const category = await Category.findById(req.params.id)
    res.status(200).json({messae:'Success..' , category})
})      

export {
    AddCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
}
