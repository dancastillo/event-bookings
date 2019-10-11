// const Event = require('./../../models/Event');
const Booking = require('./../../models/booking');
const { transformEvent, transformBooking } = require('./events');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {

    const fetchedEvent = await Event.findOne({_id: args.eventId});

    const booking = new Booking({
      user: '5d9d3a68584f1b0e61fcc06f',
      event: fetchedEvent
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);

      await Booking.deleteOne({_id: args.bookingId});

      return event;
    } catch (err) {
      throw err;
    }

  }
}
