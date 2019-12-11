import { Event } from "../../../models/Event";
import { User } from "../../../models/User";
import { transformEvent } from "./merge";
import { dateToString } from "../../../utils/date";

export const events = async () => {
  try {
    const events = await Event.find();

    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

export const createEvent = async (args: { eventInput: { title: any; description: any; price: string | number; date: any; }; }, req: { isAuth: any; }) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated');
  }
  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: dateToString(args.eventInput.date),
    /**
     * TODO remove hard coded creator
     */
    creator: '5d9d3a68584f1b0e61fcc06f'
  });

  let createdEvent;

  try {
    const result = await event.save();

    createdEvent = transformEvent(result);

    const creator = await User.findById('5d9d3a68584f1b0e61fcc06f');

    if (!creator) {
      throw new Error('User does not exist');
    }

    // @ts-ignore
    creator.createdEvents.push(event);

    await creator.save();

    return createdEvent;
  } catch (err) {
    throw err;
  }
};
