const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    rollNo: { type: String, trim: true },
    subjects: [
      {
        name: { type: String, required: true },
        marks: { type: Number, required: true, min: 0 },
        outOf: { type: Number, required: true, min: 1, default: 100 },
      },
    ],
    total: Number,
    maxTotal: Number,
    percentage: Number,
    grade: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);