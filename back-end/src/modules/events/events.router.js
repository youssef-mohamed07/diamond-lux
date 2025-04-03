import { Router } from "express";
import { uploadSinleFile } from "../../fileUpload/fileUpload.js";
import { AddEvent, getAllEvent, UpdateEvent } from "./events.controller.js";


let EventRouter = Router()

EventRouter.route('/').post(uploadSinleFile('img','Event'),AddEvent).get(getAllEvent)

EventRouter.route('/:id').put(UpdateEvent)


export default EventRouter