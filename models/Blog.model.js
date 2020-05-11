const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: { createdAt: "createdAt" } }
);
BlogSchema.index({ title: "text" });
const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
