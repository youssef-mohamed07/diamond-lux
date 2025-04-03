import mongoose,{Schema,model} from "mongoose";

const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { minimize: false })



export const Admin = model('Admin', schema)