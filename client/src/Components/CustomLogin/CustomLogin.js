/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-undef */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CustomLogin.css';
import firebase from '../../firebase';
import * as actions from '../../Actions/';
import { signInUser } from '../../utils/apiCalls';

export class CustomLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
      name: '',
      error: null,
      signin: true,
      passMatchStatus: null,
      disableSubmit: true
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });

    if (this.state.signin) {
      if (this.email.value.length >= 5 && this.password.value.length >= 5) {
        this.setState({ disableSubmit: false });
      } else {
        this.setState({ disableSubmit: true });
      }
    }

    if (!this.state.signin) {
      if (this.password.value !== this.confirmPass.value || this.email.value.length < 5 || this.password.value.length < 5) {
        this.setState({ disableSubmit: true });
      } else {
        this.setState({ disableSubmit: false });
      }

      if (event.target.name === 'confirmPass' || event.target.name === 'password') {
        if (this.password.value === this.confirmPass.value && event.target.value.length)  {
          this.setState({ passMatchStatus: '✅' });
        } else {
          this.setState({ passMatchStatus: '❌' });
        }
      }
    }




  }

  signinHandler = () => {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch( (error) => {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        this.setState({
          error: 'Invalid username or password. Please try again.'
        });

        setTimeout(() => {
          this.setState({ error: '' });
        }, 3000);
      }

      if (error.code === "auth/invalid-email") {
        this.setState({
          error: 'Invalid email.'
        });

        setTimeout(() => {
          this.setState({ error: '' });
        }, 3000);
      }
    });

    firebase.auth().onAuthStateChanged( async user => {
      if (user) {
        const { displayName, email, uid } = user;

        const dbUser = await signInUser(uid, displayName, email);
  
        this.props.validateUser(dbUser);
        localStorage.setItem('THL-FAN-USER', JSON.stringify(dbUser));
        this.props.history.push('/home');
      }
    });
  }

  signupHandler = () => {
    const { email, password } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      if (error.code === "auth/invalid-email") {
        this.setState({
          error: 'Invalid email.'
        });
      } else {
        this.setState({
          error: 'Email already in use.'
        });
      }

      setTimeout(() => {
        this.setState({ error: '' });
      }, 3000);
    });

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        firebase.auth().currentUser.updateProfile({displayName: this.state.name});

        const { email, uid } = firebase.auth().currentUser;

        const dbUser = await signInUser(uid, this.state.name, email);
  
        this.props.validateUser(dbUser);
        localStorage.setItem('THL-FAN-USER', JSON.stringify(dbUser));
        this.props.history.push('/home');
      }
    });
  }

  createForm = () => {
    if (this.state.signin) {
      return (
        <div className="CustomLogin">
          <h1>Sign in with Email</h1>
          <label>Email:</label>
          <input 
            value={this.state.email}
            ref={(input) => { this.email = input; }} 
            name="email" 
            onChange={this.handleChange} 
            autoComplete="email"            
            type="email" 
            placeholder="Email"/>
          <label>Password:</label>
          <input 
            value={this.state.password}
            ref={(input) => { this.password = input; }} 
            name="password" 
            onChange={this.handleChange} 
            type="password"
            autoComplete="current-password"            
            placeholder="Password"/>
          <Link to="/forgotpassword">Forgot Password</Link>
          <span>{this.state.error}</span>
          <button disabled={this.state.disableSubmit} ref={(button) => { this.submit = button; }} onClick={this.signinHandler}>Sign In</button>
          <button onClick={() => { this.setState({signin: !this.state.signin}); }}>Sign Up Instead</button>
        
        </div>
      );
    } else {
      return (
        <div className="CustomLogin">
          <h1>Sign Up with Email</h1>
          <label>Name:</label>
          <input 
            ref={(input) => { this.name = input; }} 
            name="name" 
            onChange={this.handleChange} 
            type="text" 
            value={this.state.name}
            autoComplete="name"
            placeholder="First/Last Name"/>
          <label>Email:</label>
          <input 
            ref={(input) => { this.email = input; }} 
            name="email" 
            onChange={this.handleChange} 
            autoComplete="email"
            type="email" 
            value={this.state.email}
            placeholder="Email"/>
          <label>Password:</label>
          <input 
            ref={(input) => { this.password = input; }} 
            name="password" 
            onChange={this.handleChange} 
            value={this.state.password}
            autoComplete="off"
            type="password" 
            placeholder="Password"/>
          <label>Confirm Password:</label>
          <div className="confirmWrapper">
            <input 
              ref={(input) => { this.confirmPass = input; }} 
              name="confirmPass" 
              onChange={this.handleChange} 
              value={this.state.confirmPass}
              autoComplete="off"              
              type="password" 
              placeholder="Confirm Password" />
            <span>{this.state.passMatchStatus}</span>        
          </div>
          <button disabled={this.state.disableSubmit} ref={(button) => { this.submit = button; }} onClick={this.signupHandler}>Sign Up</button>
          <button onClick={() => { this.setState({signin: !this.state.signin}); }}>Sign In Instead</button>
        </div>
      );
    }
  }

  render() {
    return this.createForm();
  }
}

const mapStateToProps = store => ({
  User: store.User
});

const mapDispatchToProps = dispatch => ({
  validateUser: user => dispatch(actions.updateUser(user))
});



export default connect(mapStateToProps, mapDispatchToProps)(CustomLogin);

CustomLogin.propTypes = {
  history: PropTypes.object,
  validateUser: PropTypes.func
};