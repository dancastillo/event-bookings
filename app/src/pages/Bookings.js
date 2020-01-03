import React, { Component } from 'react';

import { queryBookings, cancelBooking } from '../helpers/requestBody';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

class BookingsPage extends Component {

  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });

    fetch('http://localhost:8000/apollo', {
      method: 'POST',
      body: JSON.stringify(queryBookings),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${this.context.token}`
      }
    })
      .then(res => {
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

    fetch('http://localhost:8000/apollo', {
    method: 'POST',
    body: JSON.stringify(cancelBooking(bookingId)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${this.context.token}`
    }
    })
    .then(res => {
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
      this.setState({ isLoading: false});
    });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      this.setState({outputType: 'list'});
    } else {
      this.setState({outputType: 'chart'});
    }
  };

  render() {
    let content = <Spinner />;

    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingControls
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === 'list'
              ? (
                  <BookingList bookings={this.state.bookings}
                               onDelete={this.deleteBookingHandler}
                  />
                 )
              : (
                <BookingChart bookings={this.state.bookings} />
              )
            }
          </div>
        </React.Fragment>
      );
    }
    return (<React.Fragment>{ content }</React.Fragment>)
  }
}

export default BookingsPage;
