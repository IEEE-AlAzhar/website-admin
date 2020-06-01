const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    cover: {
      type: String,
      required: true,
    },
    images: [String],
    status: {
      type: String,
      required: true,
    },
    formLink: String,
  },
  { timestamps: { createdAt: "createdAt" } }
);
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
