import React, { Component, } from 'react';
import Login from '../authenticate/Login';

import Register from '../authenticate/Register';

import { Link } from 'react-router-dom';
class Navbar extends Component {
  render() {
    return (
      <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top myNavbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          QnA
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/sessions">
                {' '}
                Session
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            
            <li className="nav-item">
              <button className="btn btn-dark" data-toggle="modal" data-target="#loginModal">
                Login
              </button>
            </li>
            <li className="nav-item">
            <button className="btn btn-info" data-toggle="modal" data-target="#registerModal">
                Sign Up
              </button>
            </li> 
          </ul>
        </div>
      </div>
    </nav>
      <Login />
      <Register />
    </div>
    )
  }
}

export default Navbar;