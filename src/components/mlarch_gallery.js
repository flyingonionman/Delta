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
      chosenimg : null
    };
  }
  
  enlarge(number) {
    const currentState = this.state.isActive;
    this.setState({ isActive: !currentState });
    if (Number.isInteger(number)){
      this.setState({ chosenimg: number });
    }
    else{
      setTimeout(() => {this.setState({ chosenimg: null });}, 500);

    }
  }

  render() {
    return (
      <div className ="gallery">
        <Container fluid> 
          <Row>
            <Col><img  onClick={() => this.enlarge(1)} src={images["A"+1+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(2)} src={images["A"+2+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(3)} src={images["A"+3+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(4)}src={images["A"+4+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(5)}src={images["A"+5+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(6)}src={images["A"+6+".png"]}/></Col>
            <Col></Col>
            <Col></Col>
          </Row>

          <Row>
            <Col><img  onClick={() => this.enlarge(9)} src={images["A"+9+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(10)} src={images["A"+10+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(11)} src={images["A"+11+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(12)}src={images["A"+12+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(13)}src={images["A"+13+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(14)}src={images["A"+14+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(15)}src={images["A"+15+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(16)}src={images["A"+16+".png"]}/></Col>
          </Row>


          <Row>
            <Col><img  onClick={() => this.enlarge(17)} src={images["A"+17+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(18)} src={images["A"+18+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(19)} src={images["A"+19+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(20)}src={images["A"+20+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(21)}src={images["A"+21+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(22)}src={images["A"+22+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(23)}src={images["A"+23+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(24)}src={images["A"+24+".png"]}/></Col>
          </Row>


          <Row>
            <Col><img  onClick={() => this.enlarge(25)} src={images["A"+25+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(26)} src={images["A"+26+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(27)} src={images["A"+27+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(28)}src={images["A"+28+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(29)}src={images["A"+29+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(30)}src={images["A"+30+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(31)}src={images["A"+31+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(32)}src={images["A"+32+".png"]}/></Col>
          </Row>

          <Row>
           <Col><img  onClick={() => this.enlarge(33)} src={images["A"+33+".png"]}/></Col>

          </Row>

          <Row>
            <Col><img  onClick={() => this.enlarge(34)} src={images["A"+34+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(35)} src={images["A"+35+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(36)} src={images["A"+36+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(37)}src={images["A"+37+".gif"]}/></Col>
            <Col><img onClick={() => this.enlarge(38)}src={images["A"+38+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(39)}src={images["A"+39+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(40)}src={images["A"+40+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(41)}src={images["A"+41+".png"]}/></Col>
          </Row>

          <Row>
            <Col><img  onClick={() => this.enlarge(42)} src={images["A"+42+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(43)} src={images["A"+43+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(44)} src={images["A"+44+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(45)}src={images["A"+45+".gif"]}/></Col>
            <Col><img onClick={() => this.enlarge(46)}src={images["A"+46+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(47)}src={images["A"+47+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(48)}src={images["A"+48+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(49)}src={images["A"+49+".png"]}/></Col>
          </Row>

          <Row>
            <Col><img  onClick={() => this.enlarge(50)} src={images["A"+50+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(51)} src={images["A"+51+".png"]}/></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
          </Row>

          <Row>
            <Col><img  onClick={() => this.enlarge(52)} src={images["A"+52+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(53)} src={images["A"+53+".png"]}/></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
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
      case 1: return <p>AI-Progettazione an homage to the simple instructions and constructions of Enzo Mari.</p>
      case 2: return <p>A prototypical bench in the style of Enzo Mari’s Autoprogettazione.</p>;
      case 3: return <p>The four images below this represent the ground truth. The data the machine learns from.</p>;       
      case 4: return <p>You are now entering the matrix...  </p>;
      case 5: return <p>LSTM Captioning model</p>;
      case 6: return  <p>The four images in this column are outputs from machine learning models. </p>
      case 7: return  <p>Scan this on your phone! You’ll be directed right back here. Lol.</p>
      case 8: return  <p>Nailed it!</p>

      case 9: return <p>Text instruction precedents from Sol Lewitt. What we like to call a 1 dimensional instruction. </p>
      case 10: return <p>How we might make a 1D instruction for this simple bench. </p>;
      case 11: return <p>A parametrically generated data set of unique bench instructions to train with. </p>;       
      case 12: return <p>:0 </p>;
      case 13: return <p>LSTM Captioning model</p>;
      case 14: return  <p>:(</p>
      case 15: return  <p>Generated cut sheets using LSTM captioning</p>
      case 16: return  <p>JIHOOOOOOOOON.png</p>

      case 17: return <p>2 dimensional (pretend you don’t see the axon) instructions from none other than Enzo Mari.</p>
      case 18: return <p>Our interpretation of an Enzo style drawing set for a simple bench. </p>;
      case 19: return <p>A parametrically generated data set of unique bench renderings to train with.</p>;       
      case 20: return <p>:? </p>;
      case 21: return <p>Inside the mind of a progressive gan machine learning model.</p>;
      case 22: return  <p>:/</p>
      case 23: return  <p>Generated outputs from the progressive gan trained on a data set of simple bench renderings. It turned out to be too accurate, so we sought to make it all a little more crazy.</p>
      case 24: return  <p>A closer look at one of the ML generated bench images.</p>

      case 25: return <p>Oh IKEA. It’s a love hate relationship, but their assembly instructions are undeniably the quintessential non-verbal instructions. We see them as the precedent for 3D instructions, exploded axonometric drawings that illustrate dimensions to scale.</p>
      case 26: return <p>An attempt at how we might consider generating 3D instructions in axon. </p>;
      case 27: return <p>The same benches as the original “boring” data set with added parameters to randomize the data and confuse the progressive gan. The renderings depict benches that are randomly tumbling and shearing at different magnitudes so the ML model has less similarities to expect and latch on to.</p>;       
      case 28: return <p>;) </p>;
      case 29: return <p>Progressive gans eat wheaties</p>;
      case 30: return  <p>:^)</p>
      case 31: return  <p>Outputs from a slightly confused progressive gan. Note the occasional mishaps, fading edges, etc.</p>
      case 32: return  <p>A cute little asymmetrical  mini bench created by the progressive gan</p>

      case 33: return  <p>Our approach to machine learning is both generative and analytical. We use a progressive gan to create novel outputs and then feed those into a LSTM captioning model that was trained on the rendered images paired with their 3D quaternion data such that it will spit out a string of vectors (quaternions). Afterwards, we post process in Grasshopper to bring those unique quaternions back into a world where we can interact with them the CAD software.      </p>

      case 34: return <p>A parametrically generated data set of 1500 unique renderings of benches.</p>
      case 35: return <p>One of the many benches in the data set. </p>;
      case 37: return <p>A video traversing the latent space (the space between generated images) in the progressive gan.</p>;       
      case 39: return <p>After post processing this generated image from the progressive gan, here we have a 3D model!</p>;
      case 40: return <p>A post processed orthographic instruction from the infamous progressive gan image.</p>;
      case 41: return  <p>We built one of these little buddies!</p>

      case 42: return <p>1500 randomized renderings of morphing benches--two of them!--that were used to train a progress gan and ½ of the data for the LSTM captioning model.</p>
      case 43: return <p>A closer look at the kind of data being used in the models. </p>;
      case 45: return <p>A video traversing the latent space (the space between generated images) in the progressive gan.</p>; 
      case 46: return <p>A wonky output from the progressive gan trained on two benches at once.</p>; 

       default:
         return <p></p>;
     }
}

function Welcome(props) {
  if (props.name == 45 || props.name == 37  ){
    return <img src={images["A"+props.name+".gif"]}></img>;
  }
  else{
    return <img src={images["A"+props.name+".png"]}></img>;
  }

 
}


export default Mlarch;
