const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          required: true,
        },
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Students", studentSchema);
