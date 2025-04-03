import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: [
      "text",
      "email",
      "number",
      "textarea",
      "select",
      "checkbox",
      "radio",
      "date",
    ],
    required: true,
  },
  options: { type: [String], default: [] },
  required: { type: Boolean, default: false },
  defaultValue: { type: String, default: "" },
  order: { type: Number, default: 0 },
}, { _id: true });

const FormSchema = new mongoose.Schema({
  fields: [formFieldSchema],
  unavailableDates: [Date]  // Array to store unavailable dates
}, { timestamps: true });

export const Form = mongoose.model("Form", FormSchema);
