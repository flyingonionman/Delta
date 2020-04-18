import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/gallery.scss';
import RGL, { WidthProvider } from "react-grid-layout";
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


const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg|gif)$/));


class Mlarch extends React.Component {
 
  
  constructor(props) {
    super(props);
    this.enlarge = this.enlarge.bind(this);

    this.state = { 
      isActive: false ,
      chosenimg : 1
    };
  }
  
  enlarge(number) {
    const currentState = this.state.isActive;
    this.setState({ isActive: !currentState });
    if (Number.isInteger(number)){
      this.setState({ chosenimg: number });
    }
    else{
      setTimeout(() => {this.setState({ chosenimg: null });}, 700);

    }
  }

  render() {
    return (
      <div className ="gallery">
        <Container fluid> 
          <Row>
            <Col><img  onClick={() => this.enlarge(1)} src={images["p"+1+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(2)} src={images["p"+2+".gif"]}/></Col>
            <Col><img onClick={() => this.enlarge(3)} src={images["p"+3+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(4)}src={images["p"+4+".gif"]}/></Col>
            <Col><img onClick={() => this.enlarge(5)}src={images["p"+5+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(6)}src={images["p"+6+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(7)}src={images["p"+7+".png"]}/></Col>
          </Row>

          <Row>
            <Col><img src={images["p"+8+".png"]}/></Col>
            <Col><img src={images["p"+9+".png"]}/></Col>
            <Col><img src={images["p"+10+".png"]}/></Col>
            <Col><img src={images["p"+11+".png"]}/></Col>
            <Col><img src={images["p"+12+".png"]}/></Col>
            <Col><img src={images["p"+13+".png"]}/></Col>
            <Col><img src={images["p"+14+".png"]}/></Col>
          </Row>

        </Container>

        <div className={  this.state.isActive ? 'imgenlarge': 'hidden-left'}> 
            <p className={"description"}>
              <Welcome name={this.state.chosenimg} ></Welcome>
          </p>

        </div>
        
        <div className={  this.state.isActive ? 'blurb': 'hidden-right'}> 
            <p className={"description"}>
              <Describe name={this.state.chosenimg} ></Describe>


          </p>
          <button  onClick={this.enlarge}  >return</button>

        </div>
       {/*  <button id="return"><Link  style={{ textDecoration: 'none' , color:'black'}} to="/mlarch">Go back</Link></button> */}

      </div>
    );
  }
}

function Describe(props){
  console.log(props.name)

    switch(props.name) {
       case 3:
        return <p>1500 image data set of two benches randomly (and individually) rotating and shearing to create a confusing multi-perspectival images where the objects can no longer understood in reference to the ground plane.    </p>;

         break;
       case 2:
        return <p>Latent space walk in which a progressive gan is learning and becoming confused by the multi-perspectival bench images where the benches twist, grow, split, and meld like amoebas in a petri dish.</p>;

         break;
       case 1:
        return <p>1500 image data set that displays a bottom up construction approach to random timber joinery where these members are sequentially daisy-chained and occasionally become cluttered in a bird’s nest logic. </p>;
  
           break;  
        case 4:
        return <p>Latent space walk through the progressive gan trained on randomly assembled timber members at some points finding regularity with straight member perpendicularly connected while other times melting into glitchy bird’s nests  </p>;

            break;  
       default:
         return <p>I havne't figured out what to write here yet</p>;
     }
}

function Welcome(props) {
  if (props.name==2 || props.name==4){
    return <img src={images["p"+props.name+".gif"]}></img>;
  }
  else{
    return <img src={images["p"+props.name+".png"]}></img>;

  }
}


export default Mlarch;
