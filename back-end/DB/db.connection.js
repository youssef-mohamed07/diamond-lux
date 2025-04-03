import mongoose from "mongoose";
import {} from 'dotenv/config'

export const dbConnection = mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log(process.env.MONGODB_URI);
    
    console.log("Error in Database connection");
    console.log(error);
  });
