import { Router } from 'express';
import { AddinAboutUs, getAboutUs, updateAboutUs, deleteAboutUs } from './aboutUs.controller.js';
import { uploadSinleFile } from '../../fileUpload/fileUpload.js';

const AboutUsRouter = Router();

AboutUsRouter.route('/')
    .post(uploadSinleFile('image', 'about-us'), AddinAboutUs)
    .get(getAboutUs)
    .patch(uploadSinleFile('image', 'about-us'), updateAboutUs)
    .delete(deleteAboutUs);

export default AboutUsRouter;
