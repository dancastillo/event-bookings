import { Event } from "../../../models/Event";
import { Booking } from "../../../models/Booking";
import { transformBooking, transformEvent } from "./merge";
import {authUser, isAuthRequest, eventType, bookingType} from "../../../types";

export const bookings = async (args: any, req: authUser) => {
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


export const bookEvent = async (event: eventType, req: authUser) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  const fetchedEvent = await Event.findOne({ _id: event.id });

  const booking = new Booking({
    user: req.userId,
    event: fetchedEvent
  });

  const result = await booking.save();
  return transformBooking(result);
};

export const cancelBooking = async (booking: bookingType, req: isAuthRequest) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!');
  }
  try {
    const foundBooking = await Booking.findById(booking.id).populate('event');
    // @ts-ignore
    const event = transformEvent(foundBooking.event);
    await Booking.deleteOne({ _id: booking.id });
    return event;
  } catch (err) {
    throw err;
  }
};
