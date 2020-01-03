import * as React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

export const MainNavigation = (props: any) => (
  <AuthContext.Consumer>
    {(context) => {
      return (<header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>Event Bookings</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!context.token &&
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
            }
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            {context.token && (
              <React.Fragment>
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
                <li>
                  <button onClick={context.logout}>Logout</button>
                </li>
              </React.Fragment>)
            }
          </ul>
        </nav>
      </header>)
    }
    }
  </AuthContext.Consumer>
);
