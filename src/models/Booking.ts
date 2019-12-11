import mongoose from "mongoose";

export type BookingDocument = mongoose.Document & {
  event: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
};

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export const Booking = mongoose.model<BookingDocument>("Booking", bookingSchema);
