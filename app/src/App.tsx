import * as React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import './App.css';
import { MainNavigation } from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import { AuthPage } from './pages/Auth'
import { BookingsPage } from "./pages/Bookings";
import { EventsPage } from "./pages/Events";

interface IState {
  token: any;
  userId: any;
}

class App extends React.Component<{}, IState> {

  public state: IState = {
    token: null,
    userId: null
  };

  public login = (token: string, userId: string, tokenExpiration: string): void => {
    this.setState({
      token,
      userId
    })
  };

  public logout = (): void => {
    this.setState({
      token: null,
      userId: null
    });
  };

  public render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            login: this.login,
            logout: this.logout,
            token: this.state.token,
            userId: this.state.userId,
          }}>
            <MainNavigation/>
            <main className="main-content">
              <Switch>
                {/*{this.state.token && <Redirect from="/" to="/events" exact/>}*/}
                {/*{this.state.token && <Redirect from="/auth" to="/events" exact/>}*/}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage}/>
                )}
                <Route path="/events" component={EventsPage}/>
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage}/>
                )}
                {/*{!this.state.token && <Redirect to="/auth" exact/>}*/}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
