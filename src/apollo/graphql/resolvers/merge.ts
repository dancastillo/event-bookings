import DataLoader from "dataloader";
import { Event } from "../../../models/Event";
import { User } from "../../../models/User";

import { dateToString } from "../../../utils/date";

const eventLoader = new DataLoader((eventIds) => {
  // @ts-ignore
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds }});
});

const events = async (eventIds: number[]) => {
  const events = await Event.find({ _id: { $in: eventIds }});
  events.sort((a, b) => {
    return (
      eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    );
  });

  return events.map(event => {
    return transformEvent(event);
  });
};


const singleEvent = async (eventId: number) => {
  try {
    return await eventLoader.load(eventId.toString());
  } catch (err) {
    throw err;
  }
};

const user = async (userId: number) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

export const transformEvent = function (this: any, event: any) {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

export const transformBooking = function (this: any, booking: any) {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};
