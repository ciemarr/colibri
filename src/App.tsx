import React, { Component } from 'react';
import Story from './Story';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Story
          text="Hello, world!"
          title="A Greeting"
          author="CS Tradition"
          url="https://www.example.com"
         />
      </div>
    );
  }
}

export default App;
