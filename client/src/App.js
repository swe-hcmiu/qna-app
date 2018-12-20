import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppBarContainer from './containers/layout/AppBarContainer';
import Landing from './components/layout/Landing2';
import LoginContainer from './containers/auth/LoginContainer';
import RegisterContainer from './containers/auth/RegisterContainer';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import setAuthToken from './redux/utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {setCurrentUser, logOutUser} from './redux/actions/authAction';
import SessionContainer from './containers/session/SessionContainer';


// check token 
if(localStorage.jwtToken) {
  // set token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuth
  store.dispatch(setCurrentUser(decoded));
  // check expried token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logOutUser());
    window.location.href = '/login';
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <AppBarContainer />
            <Route exact path="/" component={  Landing } />
            <div className="container">
            <Route exact path="/login" component={ LoginContainer } /> 
            <Route exact path="/register" component={ RegisterContainer } /> 
            <Route exact path="/session" component={ SessionContainer } />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
