import React, { Component } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/home'
import mlarch from './components/mlarch';

class App extends React.Component {
  render() {
  return (
    <Router>
      <div className="App" >    
          <Switch>
            <Route path="/" component={Home}> </Route>
            <Route path="/mlarch" component={mlarch} ></Route>
          </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
