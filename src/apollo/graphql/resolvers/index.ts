import * as authResolver from "./auth";
import * as eventsResolver from "./events";
import * as bookingResolver from "./booking";

export const resolvers = {
  RootQuery: {
    events: () => eventsResolver.events,
    bookings: () => bookingResolver.bookings,
    login: () => authResolver.login
  },
  RootMutation: {
    createEvent: () => eventsResolver.createEvent,
    createUser: () => authResolver.createUser,
    bookEvent: () => bookingResolver.bookEvent,
    cancelBooking: () => bookingResolver.cancelBooking
  }
};
