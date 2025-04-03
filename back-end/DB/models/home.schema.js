import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    imagesCover: [String],
    Title: { type: String, required: true },
    subTitle: { type: String, required: true },
    buttonText: { type: String, required: true },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

schema.post("init", function (doc) {
  if (doc.imagesCover)
    doc.imagesCover = doc.imagesCover.map((img) => {
      if (img.startsWith("http")) return img;
      return `${
        process.env.BACKEND_URL || "http://localhost:3000"
      }/uploads/home/${img}`;
    });
});

export const Home = model("Home", schema);
