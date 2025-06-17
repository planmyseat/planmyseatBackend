import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;

const StudentSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every(s => typeof s === 'string' && s.trim().length > 0);
        },
        message: 'Subject not valid.',
      },
    },
  },
  { _id: true }
);

const YearSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 1,
    },
    students: {
      type: [StudentSchema],
      default: [],
      validate: {
        validator: function (students) {
          const uids = students.map(s => s.uid);
          return new Set(uids).size === uids.length;
        },
        message: 'Duplicate student UID found in this year.',
      },
    },
  },
  { _id: true }
);

const CourseSchema = new Schema(
  {
    course: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    years: {
      type: [YearSchema],
      default: [],
      validate: {
        validator: function (years) {
          const yearNumbers = years.map(y => y.year);
          return new Set(yearNumbers).size === yearNumbers.length;
        },
        message: 'Duplicate year found in course.',
      },
    },
  },
  {
    timestamps: true,
  }
);

CourseSchema.index({ course: 1, createdBy: 1 }, { unique: true });

export default models.Course || model('Course', CourseSchema);