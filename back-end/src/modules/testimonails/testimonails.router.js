import { Router } from "express";
import { Addtestimonail, getAlltestimonail, Updatetestimonail } from "./testimonails.controller.js";


let TestimonialRouter = Router()

TestimonialRouter.route('/').post(Addtestimonail).get(getAlltestimonail)

TestimonialRouter.route('/:id').put(Updatetestimonail)


export default TestimonialRouter