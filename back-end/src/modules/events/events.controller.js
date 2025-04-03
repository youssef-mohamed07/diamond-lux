
import { Event } from "../../../DB/models/Events.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"



const AddEvent =catchError( async(req,res,next)=>{
    req.body.image=req.file.filename
    const event = await Event.insertMany(req.body)
    res.status(200).json({messae:'Add Successfully..' , event})
})

const getAllEvent =catchError( async(req,res,next)=>{
    const events = await Event.find()
    res.status(200).json({messae:'Success..' , events})
})

const UpdateEvent =catchError( async(req,res,next)=>{
    const events = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json({messae:'Success..' , events})
})


export {
    AddEvent,
    getAllEvent,
    UpdateEvent
}
