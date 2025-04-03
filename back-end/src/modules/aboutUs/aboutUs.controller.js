import { AboutUs } from "../../../DB/models/aboutUs.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"
import dotenv from 'dotenv';

dotenv.config();

const AddinAboutUs = catchError(async (req, res, next) => {
    const existingAboutUs = await AboutUs.findOne();
    if (existingAboutUs) {
        return res.status(400).json({ message: 'About us data already exists. Use update instead.' });
    }

    const data = { ...req.body };

    if (req.file) {
        data.image = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/about-us/${req.file.filename}`; // Set the image path
    }

    const aboutUs = await AboutUs.create(data);
    res.status(201).json({ message: 'Added Successfully.', aboutUs });
});



const getAboutUs = catchError(async (req, res, next) => {
    const aboutUs = await AboutUs.findOne();
    res.status(200).json({ message: 'Success.', aboutUs });
});


const updateAboutUs = catchError(async (req, res, next) => {
    const data = { ...req.body };

    // Parse the whyChoose field if it is a string
    if (typeof data.whyChoose === 'string') {
        try {
            data.whyChoose = JSON.parse(data.whyChoose);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid format for whyChoose field.' });
        }
    }

    // Check if a file was uploaded
    if (req.file) {
        data.image = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/about-us/${req.file.filename}`; // Update the image path
    }

    const aboutUs = await AboutUs.findOneAndUpdate({}, data, {
        new: true,
        runValidators: true,
        partial: true,
    });

    res.status(200).json({ message: 'Updated Successfully.', aboutUs });
});



const deleteAboutUs = catchError(async(req,res,next)=>{
    const aboutUs = await AboutUs.deleteOne();
    res.status(200).json({message:'Success..' , aboutUs})
})

export {
    AddinAboutUs,
    getAboutUs,
    updateAboutUs,
    deleteAboutUs
}