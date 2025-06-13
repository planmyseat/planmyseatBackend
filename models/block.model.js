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
