import React from 'react';

import './BookingControl.css'

export const BookingControls = props => {
  return (
    <div className='booking-control'>
      <button className={props.activeOutputType === 'list' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'list')}>
        List
      </button>
      <button className={props.activeOutputType === 'chart' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'chart')}>
        Chart
      </button>
    </div>
  )
};
