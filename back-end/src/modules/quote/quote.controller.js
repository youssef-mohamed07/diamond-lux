import { Quote } from "../../../DB/models/quote.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"



const sendQuote =catchError( async(req,res,next)=>{
    const quote = await Quote.insertMany(req.body)
    res.status(200).json({messae:'Quote Sent Successfully..' , quote})
})



export{
    sendQuote
}