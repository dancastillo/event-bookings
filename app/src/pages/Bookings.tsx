import * as React from 'react';

import { BookingControls } from '../components/Bookings/BookingControls/BookingControls';
import { BookingList } from '../components/Bookings/BookingList/BookingList';
import { Spinner } from '../components/Spinner/Spinner';
// import AuthContext from '../context/auth-context';
// import BookingChart from '../components/Bookings/BookingChart/BookingChart';

import { cancelBooking, queryBookings } from '../helpers/requestBody';

interface IBookingsState {
  isLoading: boolean;
  bookings: any[];
  outputType: string;
}

export class BookingsPage extends React.Component<{}, IBookingsState> {

  // static contextType = AuthContext;

  public state: IBookingsState = {
    bookings: [],
    isLoading: false,
    outputType: 'list'
  };


  public componentDidMount() {
    this.fetchBookings();
  }

  public fetchBookings = () => {
    this.setState({ isLoading: true });

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(queryBookings),
      headers: {
        'Authorization': `Bearer: ${this.context.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`Failed: ${res.status}`);
        }

        return res.json();
      })
      .then(data => {
        const { bookings } = data.data;

        this.setState({ bookings, isLoading: false})
      })
      .catch(err => {
        this.setState({ isLoading: false});
      });
  };

  public showDetailHandler = (eventId: string) => {
    // @ts-ignore
    this.setState((prevState: IBookingsState) => {
      // @ts-ignore
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent };
    });
  };

  public deleteBookingHandler = (bookingId: string) => {
    this.setState({ isLoading: true });

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(cancelBooking(bookingId)),
      headers: {
        'Authorization': `Bearer: ${this.context.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`Failed: ${res.status}`);
        }

        return res.json();
      })
      .then(data => {
        this.setState((prevState: IBookingsState) => {
          const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        this.setState({ isLoading: false});
      });
  };

  public changeOutputTypeHandler = (outputType: string) => {
    if (outputType === 'list') {
      this.setState({outputType: 'list'});
    } else {
      this.setState({outputType: 'chart'});
    }
  };

  public render() {
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
                <div>Here</div>
                // <BookingChart bookings={this.state.bookings} />
              )
            }
          </div>
        </React.Fragment>
      );
    }
    return (<React.Fragment>{ content }</React.Fragment>)
  }
}
