import * as React from 'react';

import './Modal.css';

interface IProps {
  title: string;
  children: any;
  onCancel: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  onConfirm: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  canCancel: boolean;
  canConfirm: boolean;
  confirmText: string;
}

export const Modal = (props: IProps) => (
  <div className='modal'>
    <header className='modal__header'>
      <h1>{props.title}</h1>
    </header>
    <section className='modal__content'>
      {props.children}
    </section>
    <section className='modal__actions'>
      {props.canCancel &&
      <button className='btn' onClick={props.onCancel}>
        Cancel
      </button>
      }
      {props.canConfirm &&
      <button className='btn' onClick={props.onConfirm}>
        {props.confirmText}
      </button>
      }
    </section>
  </div>
);
