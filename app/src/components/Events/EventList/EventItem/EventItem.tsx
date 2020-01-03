import * as React from 'react';

import './EventItem.css';

interface IProps {
  eventId: string | number | undefined;
  title: React.ReactNode;
  price: React.ReactNode;
  date: string | number | Date;
  userId: any;
  creatorId: any;
  onDetail: any;
}

// @ts-ignore
export const EventItem = (props: IProps) => (
  <li key={props.eventId} className='events__list-item'>
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>Your the owner of this event.</p>
      ) : (
        <button
          className='btn'
          // @ts-ignore
          onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);
