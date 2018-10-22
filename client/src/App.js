import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/authenticate/Register';
import Session from './components/session/Session';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={  Landing } />
          <div className="container">
          <Route exact path="/register" component={  Register } />
          
          <Route exact path="/sessions" component={ Session } />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
