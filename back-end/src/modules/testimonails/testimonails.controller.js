import { Testimonial } from "../../../DB/models/Testimonials.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"
import { ApiFeatures } from "../../utils/apiFeature.js"



const Addtestimonail =catchError( async(req,res,next)=>{
    const testimonial = await Testimonial.insertMany(req.body)
    res.status(200).json({messae:'testimonail Add Successfully..' , testimonial})
})

const getAlltestimonail =catchError( async(req,res,next)=>{
    let apiFeature =new ApiFeatures(Testimonial.find(), req.query).pagination()
    const testimonial = await apiFeature.mongooseQuery 
    res.status(200).json({messae:'Success..' , testimonial})
})

const Updatetestimonail =catchError( async(req,res,next)=>{
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id , req.body , {new:true})
    res.status(200).json({messae:'testimonail Add Successfully..' , testimonial})
})



export {
    Addtestimonail,
    getAlltestimonail,
    Updatetestimonail
}
