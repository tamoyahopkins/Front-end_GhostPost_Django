import React, { Component } from "react";
// import { Switch, Route } from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
// import {getCsrfToken, testRequest} from './components/ghostpost'
import GhostPost from './components/ghostpost'

class App extends Component {
  render() {
    return (
        <GhostPost />
    );
  }
}

export default App;
