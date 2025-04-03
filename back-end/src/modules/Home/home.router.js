import { Router } from "express";
import { uploadMixOFFiles } from "../../fileUpload/fileUpload.js";
import adminAuth from "../../MiddleWares/adminAuth.js";
import { AddtoHome, getHome, UpdatHome, deleteHome } from "./home.controller.js";

let HomeRouter = Router()

HomeRouter.post('/',adminAuth,uploadMixOFFiles([{name:'imagesCover',maxCount:5}],'home'),AddtoHome)
HomeRouter.get('/',getHome)
HomeRouter.patch('/:id', adminAuth, uploadMixOFFiles([
    { name: 'imagesCover', maxCount: 5 }
], 'home'), UpdatHome)
HomeRouter.delete('/:id', adminAuth, deleteHome)
export default HomeRouter