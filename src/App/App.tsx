import React, { Component } from 'react';
import axios from 'axios';
import StoryLoader from '../Story/StoryLoader';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import './App.scss';
import localforage from 'localforage';

class App extends Component {
  public render() {
    // tslint:disable jsx-no-lambda jsx-no-multiline-js
    return (
      <div className="App">

        <BrowserRouter>
          <Switch>

            <Route
              path="/story"
              exact={true}
              render={() => <StoryLoader axios={axios} storage={localforage} />}
            />

            <Route
              path="*"
              render={() => {
                return (
                  <p>
                    Page not found.
                    Try <a href="/story">/story</a>.
                  </p>
                );
              }}
            />

          </Switch>
        </BrowserRouter>

      </div>
    );
    // tslint:enable jsx-no-lambda jsx-no-multiline-js
  }
}

export default App;
