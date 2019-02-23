import React, { Component } from 'react';
import Story from './Story';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Story text="Hello, world!" />
      </div>
    );
  }
}

export default App;
