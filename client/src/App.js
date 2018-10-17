import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
      </div>
    );
  }
}

export default App;
