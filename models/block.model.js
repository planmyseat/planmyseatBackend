import mongoose, { Schema, Types } from 'mongoose';

const ClassSchema = new Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
    row: {
      type: Number,
      required: true,
      min: 1,
    },
    columns: {
      type: Number,
      required: true,
      min: 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const BlockSchema = new Schema(
  {
    block: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classes: {
      type: [ClassSchema],
      default: [],
      validate: {
        validator: function (classes) {
          const classNames = classes.map(cls => cls.className);
          const uniqueNames = new Set(classNames);
          return classNames.length === uniqueNames.size;
        },
        message: 'Class names must be unique within a block.',
      },
    },
  },
  {
    timestamps: true,
  }
);

BlockSchema.pre('save', function (next) {
  this.classes = this.classes.map((cls) => ({
    ...cls,
    capacity: cls.row * cls.columns,
  }));
  next();
});

BlockSchema.index({ createdBy: 1, block: 1 }, { unique: true });

const BlockModel = mongoose.models.Block || mongoose.model('Block', BlockSchema);

export default BlockModel;
