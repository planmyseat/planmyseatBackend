import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;

const studentSeatSchema = new Schema(
  {
    uid: { type: String, required: true },
    name: { type: String, required: false },
    course: { type: String, required: true },
    className: { type: String, required: true },
    seat: {
      row: { type: Number  },
      column: { type: Number },
    },
  },
  { _id: false }
);

const courseInfoSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    yearId: { type: Types.ObjectId, required: true },
    subject: { type: String, required: true },
  },
  { _id: false }
);

const seatingPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    session: { type: String, required: true },
    blockId: { type: Types.ObjectId, ref: 'Block', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    students: [studentSeatSchema],  
    courses: [courseInfoSchema],  
  },
  { timestamps: true }
);

const SeatingPlan = models.SeatingPlan || model('SeatingPlan', seatingPlanSchema);

export default SeatingPlan;
