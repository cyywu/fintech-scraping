import React, { Component } from 'react';
import logo from './database.png';
import './App.css';
import MotherWrapper from './components/Mother_Wrapper'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component {

  render() {

    return (
      <div className="App">

        <script src="/__/firebase/7.11.0/firebase-app.js"></script>
        <script src="/__/firebase/7.11.0/firebase-analytics.js"></script>
        <script src="/__/firebase/init.js"></script>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"/> */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>

        <div className="outermost-wrapper">

          <Router>

            <div className="top-bar">
              <div className="top-bar-wrapper">

                <img src={logo} className="App-logo" alt="logo" />

                <Link
                  className="home-button"
                  to={{
                    pathname: "/",
                  }}>
                  <p>FinTech Scraping</p>
                </Link>

                <Link
                  className="subscribe-button" 
                  to={{
                    pathname: "/subscribe",
                  }}>
                  Subscribe
                </Link>

              </div>
            </div>

            <div className="main-div">
              <MotherWrapper />
            </div>

          </Router>

        </div>

      </div>
    );
  }
}

export default App;
