import { Schema, model } from "mongoose";

const schema = new Schema({
  logoImage: {
    type: String,
    required: true,
  },
  footer: {
    description: {
      type: String,
      default:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      required: true,
    },
  },
});

export const UI = model("UI", schema);
