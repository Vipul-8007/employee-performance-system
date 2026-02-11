const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    skillLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    attendanceScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    currentSalary: {
      type: Number,
      required: true,
    },

    hikePercentage: {
      type: Number,
    },

    revisedSalary: {
      type: Number,
    },

    promotionRecommendation: {
      type: String,
      enum: ["YES", "NO"],
      default: "NO",
    },

    performanceSummary: {
      type: String,
    },
  },
  { timestamps: true },
);

performanceSchema.index({ employee: 1 }, { unique: true });

module.exports = mongoose.model("Performance", performanceSchema);
