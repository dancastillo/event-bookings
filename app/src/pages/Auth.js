import React, { Component } from 'react';
import { login, createUser } from '../helpers/requestBody';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      }
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim() === 0) {
      return;
    }

    const requestBody = (!this.state.isLogin) ? createUser(email, password) : login(email, password);

    fetch('http://localhost:8000/apollo', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
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
      .catch(err => console.log(err));
  };

  render() {
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

export default AuthPage;
