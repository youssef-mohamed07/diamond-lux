import { Router } from "express";
import { uploadSinleFile } from "../../fileUpload/fileUpload.js";
import { AddCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from "./category.controller.js";

let CategoryRouter = Router()

CategoryRouter.route('/').post(uploadSinleFile('img','category'),AddCategory).get(getAllCategory)
CategoryRouter.route('/:id').put(uploadSinleFile('img','category'),updateCategory).delete(deleteCategory).get(getCategoryById)




export default CategoryRouter