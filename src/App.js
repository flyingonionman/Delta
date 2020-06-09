import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import Home from './components/home'

import Mlarch from './components/mlarch';
import MlarchGallery from './components/mlarch_gallery';
import Datasci from './components/datasci';
import Graphic from './components/design_gallery';

import {isMobile} from 'react-device-detect';

class App extends React.Component {
  render() {
  if (isMobile) {
      return <div> This content is unavailable on mobile</div>
  } 
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

            <Route path="/datasci" >
              
              <Datasci/>
            </Route>

            <Route path="/graphicdesign" >
              
              <Graphic/>
            </Route>
            {/* <Route path="/bideogames" >
              <Bideo/>
            </Route> */}
            
          </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
