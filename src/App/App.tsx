import React, { Component } from 'react';
import axios from 'axios';
import StoryLoader from '../Story/StoryLoader';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import './App.scss';

class App extends Component {
  public render() {
    // tslint:disable jsx-no-lambda
    return (
      <div className="App">

        <BrowserRouter>
          <Switch>

            <Route
              path="/story"
              exact={true}
              render={() => <StoryLoader axios={axios} />}
            />

            <Route path="*" render={() => <p>Page not found.</p>} />

          </Switch>
        </BrowserRouter>

      </div>
    );
    // tslint:enable jsx-no-lambda
  }
}

export default App;
