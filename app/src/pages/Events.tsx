import * as React from 'react';
import { Backdrop } from '../components/Backdrop/Backdrop'
import { EventList } from '../components/Events/EventList/EventList';
import { Modal } from '../components/Modal/Modal';
import { Spinner } from '../components/Spinner/Spinner';
// import AuthContext from '../context/auth-context';

import { bookEvent, createEvent, queryEvents } from "../helpers/requestBody";
import './Events.css';

interface IEventsState {
  creating: boolean;
  events: any[];
  isLoading: boolean;
  selectedEvent: any;
}

export class EventsPage extends React.Component<{}, IEventsState> {

  // static contextType = AuthContext;

  public state: IEventsState = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  private isActive = true;

  private readonly titleElRef: React.RefObject<HTMLInputElement>;
  private readonly priceElRef: React.RefObject<HTMLInputElement>;
  private readonly dateElRef: React.RefObject<HTMLInputElement>;
  private readonly descriptionElRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Readonly<{}>) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  public componentDidMount() {
    this.fetchEvent();
  }

  public startCreateEventHandler = () => {
    this.setState({creating: true})
  };

  public modalConfirmHandler = () => {
    this.setState({creating: false});
    // @ts-ignore
    const titleValue = this.titleElRef.current.value;
    // @ts-ignore
    const priceValue = parseFloat(this.priceElRef.current.value);
    // @ts-ignore
    const dateValue = this.dateElRef.current.value;
    // @ts-ignore
    const descriptionValue = this.descriptionElRef.current.value;

    if (
      titleValue.trim().length === 0 ||
      priceValue <= 0 ||
      dateValue.trim().length === 0 ||
      descriptionValue.trim().length === 0
    ) {
      return;
    }

    const requestBody = createEvent(titleValue, priceValue, dateValue, descriptionValue);

    const token = this.context.token;

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(requestBody),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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
        this.setState((prevState: IEventsState) => {
          const { _id, title, description, date, price } = data.data.createEvent;
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id,
            creator: {
              _id: this.context.userId
            },
            date,
            description,
            price,
            title,
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  public modalCancelHandler = () => {
    this.setState({creating: false, selectedEvent: null});
  };

  public fetchEvent = () => {
    this.setState({ isLoading: true });
    const requestBody = queryEvents();

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
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
        const { events } = data.data;
        if (this.isActive) {
          this.setState({ events, isLoading: false})
        }
      })
      .catch(err => {
        if (this.isActive) {
          this.setState({ isLoading: false});
        }
      });
  };

  public showDetailHandler = (eventId: string) => {
    this.setState((prevState: IEventsState) => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent };
    });
  };

  public bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = bookEvent(this.state.selectedEvent._id);

    const token = this.context.token;

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(requestBody),
      headers: {
        'Authorization': `Bearer ${token}`,
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
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        this.setState({ selectedEvent: null });
      });
  };

  public componentWillUnmount() {
    this.isActive = false;
  }

  public render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating &&
        (<Modal title='Add Event'
                canCancel={true}
                canConfirm={false}
                onCancel={this.modalCancelHandler}
                onConfirm={this.modalConfirmHandler}
                confirmText='Confirm'>
            <p>Modal Content</p>
            <form>
              <div className='form-control'>
                <label htmlFor="title">Title</label>
                <input type="text" id='title' ref={this.titleElRef}/>
              </div>
              <div className='form-control'>
                <label htmlFor="price">Price</label>
                <input type="number" id='price' ref={this.priceElRef}/>
              </div>
              <div className='form-control'>
                <label htmlFor="date">Date</label>
                <input type="date" id='date' ref={this.dateElRef}/>
              </div>
              <div className='form-control'>
                <label htmlFor="description">Description</label>
                // @ts-ignore
                <textarea rows='4' id='description' ref={this.descriptionElRef}/>
              </div>
            </form>
          </Modal>
        )}
        { this.state.selectedEvent &&
        (<Modal title={this.state.selectedEvent.title}
                canCancel={false}
                canConfirm={true}
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookEventHandler}
                confirmText={this.context.token ? 'Book' : 'Confirm'}>
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token &&
        (<div className='events-control'>
          <p>Share your own events!</p>
          <button className='btn' onClick={this.startCreateEventHandler}>Create Event</button>
        </div>)
        }
        { this.state.isLoading
          ? (<Spinner />)
          : (<EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />)
        }
      </React.Fragment>
    );
  }
}
