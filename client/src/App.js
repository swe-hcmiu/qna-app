import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppBar from './components/layout/AppBar';
import Landing from './components/layout/Landing2';
import Register from './components/authenticate/Register';
import Session from './components/session/Session';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import setAuthToken from './redux/utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {setCurrentUser} from './redux/actions/authAction';


// check token 
if(localStorage.jwtToken) {
  // set token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuth
  store.dispatch(setCurrentUser(decoded));
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <AppBar />
            <Route exact path="/" component={  Landing } />
            <div className="container">
            <Route exact path="/register" component={  Register } />
            
            <Route exact path="/sessions" component={ Session } />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
