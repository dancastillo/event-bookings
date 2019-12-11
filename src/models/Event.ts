import mongoose from "mongoose";

export type EventDocument = mongoose.Document & {
  title: string;
  description: string;
  price: number;
  date: string;
  creator: mongoose.Schema.Types.ObjectId;
};

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export const Event = mongoose.model<EventDocument>("Event", eventSchema);
