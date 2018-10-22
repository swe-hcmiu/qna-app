import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="curtain"></div>
        <div className="landing-content">
          <h1 className="title">Questions and Answers</h1>
          <form className="search">

            <MediaQuery query="(max-device-width: 768px)">
            <input
                type="text"
                className="form-control"
                placeholder="Search for sessions"
                
              />
              
              <button className="btn mx-auto search-button" type="submit">Search</button>
            </MediaQuery>

            <MediaQuery query="(min-device-width: 768px)">
            <div className="input-group mb-3">
              
              <input
                type="text"
                className="form-control"
                placeholder="Search for sessions"
              />
              <button className="btn search-button" type="submit">Search</button>
            </div>
            </MediaQuery>

          </form>

        </div>
        
      </div>
    );
  }
}

export default Landing;