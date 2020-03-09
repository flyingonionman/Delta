import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/home'
import Mlarch from './components/mlarch';

class App extends React.Component {
  render() {
  return (
    <Router>
      <div  >    
          <Switch>
            <Route exact path="/" > 
              <Home/>
            </Route>
            <Route path="/mlarch" >
              <Mlarch/>
            </Route>
          </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
