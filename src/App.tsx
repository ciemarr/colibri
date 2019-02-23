import React, { Component } from 'react';
import Story from './Story';

class App extends Component {
  public render() {
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
