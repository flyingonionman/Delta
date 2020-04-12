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
import MlarchGallery from './components/mlarch_gallery';

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

            <Route path="/mlarch_gallery" >
              
              <MlarchGallery/>
            </Route>
          </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
