import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Question And Anwser</h1>
                
                <input className="textbox col align-self-center" type="text" placeholder="Find Your Session" />
                <input title="Search" value="" type="submit" className="button"/>
               
                <hr /> 
                <Link to="/register" className="btn btn-lg btn-info mr-3">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;