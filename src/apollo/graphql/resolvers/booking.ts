import { Event } from "../../../models/Event";
import { Booking } from "../../../models/Booking";
import { transformBooking, transformEvent } from "./merge";

export const bookings = async (args: any, req: { isAuth: any; userId: any; }) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const bookings = await Booking.find({ user: req.userId });
    return bookings.map((booking: any) => {
      return transformBooking(booking);
    });
  } catch (err) {
    throw err;
  }
};

export const bookEvent = async (args: { eventId: any; }, req: { isAuth: any; userId: any; }) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  const fetchedEvent = await Event.findOne({ _id: args.eventId });
  const booking = new Booking({
    user: req.userId,
    event: fetchedEvent
  });
  const result = await booking.save();
  return transformBooking(result);
};
export const cancelBooking = async (args: { bookingId: any; }, req: { isAuth: any; }) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const booking = await Booking.findById(args.bookingId).populate('event');
    // @ts-ignore
    const event = transformEvent(booking.event);
    await Booking.deleteOne({ _id: args.bookingId });
    return event;
  } catch (err) {
    throw err;
  }
};
