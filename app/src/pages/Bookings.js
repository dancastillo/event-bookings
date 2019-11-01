import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingsPage extends Component {

  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${this.context.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`Failed: ${res.status}`);
        }

        return res.json();
      })
      .then(data => {
        const { bookings } = data.data

        this.setState({ bookings, isLoading: false})
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoading: false});
      });
  };

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent };
    });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            mutation {
              cancelBooking (bookingId: "${bookingId}"){
                _id
                title
              }
            }
          `
    };

    fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${this.context.token}`
    }
    })
    .then(res => {
    console.log(res)
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Failed: ${res.status}`);
    }

    return res.json();
    })
    .then(data => {
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
        return { bookings: updatedBookings, isLoading: false };
      });
    })
    .catch(err => {
      console.log(err)
      this.setState({ isLoading: false});
    });
  };

  render() {
    return (
      <React.Fragment>
        { this.state.isLoading
          ? <Spinner/>
          : (
            <BookingList bookings={this.state.bookings}
              onDelete={this.deleteBookingHandler}/>
          )
        }
    </React.Fragment>)
  }
}

export default BookingsPage;
