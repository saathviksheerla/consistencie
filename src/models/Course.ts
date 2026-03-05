import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        url: { type: String, default: "" },
        totalLessons: { type: Number, required: true },
        completedLessons: { type: Number, default: 0 },
        category: { type: String, required: true }, // Replaced strict union with standard string for custom categories
    },
    { timestamps: true }
);

const Course = models.Course || model("Course", CourseSchema);

export default Course;
