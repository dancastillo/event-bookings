import * as React from 'react';
// import AuthContext from '../context/auth-context';
import { createUser, login } from '../helpers/requestBody';

import './Auth.css';

interface IAuthState {
  isLogin: boolean;
}

export class AuthPage extends React.Component<{}, IAuthState> {
  public state: IAuthState = {
    isLogin: true
  };

  // private static contextType = AuthContext;
  private readonly emailEl: React.RefObject<HTMLInputElement>;
  private readonly passwordEl: React.RefObject<HTMLInputElement>;

  constructor(props: Readonly<{}>) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  public switchModeHandler = () => {
    this.setState((prevState: IAuthState) => {
      return {
        isLogin: !prevState.isLogin
      }
    });
  };

  public submitHandler = (event: any)=> {
    event.preventDefault();
    // @ts-ignore
    const email = this.emailEl.current.value;
    // @ts-ignore
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = (!this.state.isLogin) ? createUser(email, password) : login(email, password);

    fetch('http://localhost:8000/apollo', {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`Failed: ${res.status}`);
        }

        return res.json();
      })
      .then(data => {
        if (data.data.login.token) {
          const { token, userId, tokenExpiration } = data.data.login;
          this.context.login(token, userId, tokenExpiration);
        }
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  };

  public render() {
    return <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={this.emailEl}/>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl}/>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>
      </div>
    </form>;

  }
}
