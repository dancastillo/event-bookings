import * as authResolver from "./auth";
import * as eventsResolver from "./events";
import * as bookingResolver from "./booking";
import {
  authUser,
  bookingType,
  createUserArgs,
  eventInputType,
  eventType,
  isAuthRequest,
  userInput
} from "../../../types";

export const resolvers = {
  RootQuery: {
    events: () => eventsResolver.events(),
    bookings: (args: any, req: authUser) => bookingResolver.bookings(args, req),
    login: (input: userInput) => authResolver.login(input)
  },
  RootMutation: {
    createEvent: (eventArgs: eventInputType, req: isAuthRequest) => eventsResolver.createEvent(eventArgs, req),
    createUser: (userArgs: createUserArgs) => authResolver.createUser(userArgs),
    bookEvent: (event: eventType, req: authUser) => bookingResolver.bookEvent(event, req),
    cancelBooking: (booking: bookingType, req: isAuthRequest) => bookingResolver.cancelBooking(booking, req)
  }
};
