import { Home } from "../../../DB/models/home.schema.js"
import { catchError } from "../../MiddleWares/CatchError.js"
import { ApiFeatures } from "../../utils/apiFeature.js"
import { AppError } from "../../utils/appError.js"
import dotenv from 'dotenv';
import { deleteFile, extractFilename } from '../../utils/fileHandler.js'
dotenv.config();
const AddtoHome = catchError(async(req,res,next)=>{
    // Check if home data already exists
    const existingHome = await Home.findOne({})
    if(existingHome) {
        return next(new AppError('Home data already exists. Use update instead.', 400))
    }
    
    if(req.files?.imagesCover) {
        req.body.imagesCover = req.files.imagesCover.map(img => img.filename)
    }
    
    const home = await Home.create(req.body)
    
    // Add full URLs to the response
    if (home.imagesCover) {
        home.imagesCover = home.imagesCover.map(img => 
            `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/home/${img}`
        )
    }
    
    res.status(201).json({message:'Success', home})
})
const getHome = catchError(async(req, res, next) => {
    const home = await Home.findOne({})
    if(!home) {
        // Instead of throwing an error, return an empty response
        return res.status(200).json({
            message: 'Success',
            home: null
        })
    }
    
    // Add http:// to image URLs if they exist
    if (home.imagesCover) {
        home.imagesCover = home.imagesCover.map(img => {
            // Extract just the filename if it's a full URL
            if (img.includes('localhost:3000/uploads/home/')) {
                const filename = img.split('/').pop() // Get the last part of the URL
                return `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/home/${filename}`
            }
            // If it's just a filename, add the full URL
            if (!img.includes('://')) {
                return `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/home/${img}`
            }
            return img
        })
    }
    res.status(200).json({message:'Success', home})
})
const UpdatHome = catchError(async (req, res, next) => {
    // Find the home document first
    const home = await Home.findOne({})
    if (!home) {
        return next(new AppError('Home data not found', 404))
    }

    // Get current images array and convert URLs to filenames
    let currentImages = home.imagesCover.map(url => extractFilename(url))

    // Update only specific positions with new images
    if (req.files?.imagesCover) {
        const positions = Array.isArray(req.body.imagePositions) 
            ? req.body.imagePositions 
            : [req.body.imagePositions]

        req.files.imagesCover.forEach((file, idx) => {
            const position = parseInt(positions[idx])
            if (!isNaN(position)) {
                // Update only the specified position
                currentImages[position] = file.filename
            }
        })

        // Keep all existing images, just update the specified positions
        req.body.imagesCover = currentImages
    }

    // Update the document
    const updatedHome = await Home.findByIdAndUpdate(
        home._id,
        req.body,
        { new: true, runValidators: true }
    )

    // Add full URLs to the response
    if (updatedHome.imagesCover) {
        updatedHome.imagesCover = updatedHome.imagesCover.map(img => 
            `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/home/${img}`
        )
    }

    res.status(200).json({
        message: "Updated successfully",
        home: updatedHome
    })
})
const deleteHome = catchError(async(req, res, next) => {
    const home = await Home.findById(req.params.id)
    if (!home) {
        return next(new AppError('Home data not found', 404))
    }

    // Delete all associated images
    if (home.imagesCover) {
        home.imagesCover.forEach(url => {
            const filename = extractFilename(url)
            if (filename) {
                deleteFile(filename, 'home')
            }
        })
    }

    await Home.findByIdAndDelete(req.params.id)

    res.status(200).json({
        message: "Deleted successfully"
    })
})
export{
    AddtoHome,  
    getHome,
    UpdatHome,
    deleteHome
}