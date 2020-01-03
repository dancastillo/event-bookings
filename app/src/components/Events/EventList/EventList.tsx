import * as React from 'react';

import { EventItem } from './EventItem/EventItem';
import './EventList.css';

interface IEvent {
  _id: any;
  title: any;
  price: any;
  date: any;
  creator: {
    _id: any;
  };
}

interface IProps {
  events: IEvent[];
  authUserId: any;
  onViewDetail: any;
}

export const EventList = (props: IProps) => {
  const events = props.events.map((event: IEvent ) => {
    return <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      userId={props.authUserId}
      creatorId={event.creator._id}
      onDetail={props.onViewDetail}/>
  });
  return (<ul className='event__list'>
    {events}
  </ul>)
};
