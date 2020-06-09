import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/design.scss';
import _ from "lodash";
import { Container, Row, Col } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });

  return images;
}


const images = importAll(require.context('../images/design', false, /\.(png|jpe?g|svg|gif)$/));


class Mlarch extends React.Component {
 
  
  constructor(props) {
    super(props);

    this.state = { 
      isActive: false ,
      chosenimg : null
    };
  }
  

  render() {
    return (
      <div className ="design">
        <div className = "design_container"> 
            <div className= "design_images">
            
                 <img  src={images["d"+5+".png"]}/>
                   
           </div>

          <div className = "design_descriptions">

                <div className = "design_desc">
                    Description of the portfolio
                </div>
                    

          </div> 
        </div>
      </div>
    );
  }
}



function Welcome(props) {

 
}


export default Mlarch;
