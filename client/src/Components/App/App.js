import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import Header from '../Header/Header';
import Welcome from '../Welcome/Welcome';
import UserActions from '../UserActions/UserActions';
import UserProfile from '../UserProfile/UserProfile';
import AdminDashboard from '../AdminDashboard/AdminDashboard';

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverRes: null
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route path='/admin' component={AdminDashboard} />
          <Route path='/home' component={UserActions} />
          <Route path='/profile' component={UserProfile} />
          <Route exact path='/' component={Welcome} />
        </Switch>
      </div>
    );
  }
}

export default App;
