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
const gifs = [36,37,38,44,45,47,54,56]


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

  Lister(row) {
    const listItems = row.map((number) =>
        this.gifcheck(number)
    );
    return (
      <>{listItems}</>
    );
  }

  Grider(grid){
    const grided = grid.map((select) =>
        <Row>{this.Lister(select)}</Row>
    );
    return (
      <>{grided}</>
    );
  }
  
  gifcheck(num){
    if (gifs.includes(num)){
      return(
        <Col><img key={num.toString()}  onClick={() => this.enlarge(num)} src={images["A"+num+".gif"]}/></Col>
      )
    }
    else{
      return(
        <Col><img key={num.toString()}  onClick={() => this.enlarge(num)} src={images["A"+num+".png"]}/></Col>
      )
    }
  }
  


  render() {
    const first_row = [1,2,3,4,5,6,7,8]
    const second_row = [9,10,11,12,13,14,15,16]
    const third_row = [17,18,19,20,21,22,23,24]
    const fourth_row = [25,26,27,28,29,30,31,32]
    const fifth_row = [34,35,36,37,38,39,40,41]
    const sixth_row = [42,43,44,45,46,47,48,49]
    const seventh_row = [50,51,54,56,100,100,100,100]
    const eighth_row = [52,53,55,100,100,100,100,100]
    const extra = [33]

    const grid = [first_row,second_row,third_row,fourth_row,extra,fifth_row,sixth_row,seventh_row,eighth_row]
    return (
      <div className ="gallery">
        <ul>
              <li><a>MINYOUNG NA // minyoungwork1997@gmail.com //</a><a href="https://www.minyoungna.com">Return Home</a></li>
        </ul>
        <Container fluid> 
          {this.Grider(grid)}
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
      </div>
    );
  }
}

function Describe(props){

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
      case 36: return <p>Rotate Y-Rotate Z-Scale X, Rotate Z, Rotate Y , 0 <br></br>
      Rotate Z, Rotate X-Rotate Z-Scale Y, Rotate X , 0 <br></br>
      Rotate Y, Rotate X, Rotate X-Rotate Y-Scale Z , 0 <br></br>
      Move X,	            Move Y,             Move Z ,           0</p>;
      case 37: return <p>A video traversing the latent space (the space between generated images) in the progressive gan.</p>;       
      case 39: return <p>After post processing this generated image from the progressive gan, here we have a 3D model!</p>;
      case 40: return <p>A post processed orthographic instruction from the infamous progressive gan image.</p>;
      case 41: return  <p>We built one of these little buddies!</p>

      case 42: return <p>1500 randomized renderings of morphing benches--two of them!--that were used to train a progress gan and ½ of the data for the LSTM captioning model.</p>
      case 43: return <p>A closer look at the kind of data being used in the models. </p>;
      case 44: return <p>Rotate Y-Rotate Z-Scale X, Rotate Z, Rotate Y , 0 <br></br>
      Rotate Z, Rotate X-Rotate Z-Scale Y, Rotate X , 0 <br></br>
      Rotate Y, Rotate X, Rotate X-Rotate Y-Scale Z , 0 <br></br>
      Move X,	            Move Y,             Move Z ,           0</p>; 
      case 45: return <p>A video traversing the latent space (the space between generated images) in the progressive gan.</p>; 
      case 46: return <p>A wonky output from the progressive gan trained on two benches at once.</p>; 

      case 50: return <p>A parametrically generated data set of 1500 unique renderings of wood framed buildings. </p>;
      case 51: return <p>One image of randomly joined wood. </p>; 
      case 54: return <p> Rotate Y-Rotate Z-Scale X, Rotate Z, Rotate Y , 0 <br></br>
      Rotate Z, Rotate X-Rotate Z-Scale Y, Rotate X , 0 <br></br>
      Rotate Y, Rotate X, Rotate X-Rotate Y-Scale Z , 0 <br></br>
      Move X,	            Move Y,             Move Z ,           0</p>;
      case 56: return <p>A video traversing the latent space (the space between generated images) in the progressive gan. </p>; 

      case 52: return <p>A parametrically generated data set of 1500 unique renderings of wood framed buildings. </p>;
      case 53: return <p>One  wood frame buildings. </p>; 
      case 55: return <p>Rotate Y-Rotate Z-Scale X, Rotate Z, Rotate Y , 0 <br></br>
      Rotate Z, Rotate X-Rotate Z-Scale Y, Rotate X , 0 <br></br>
      Rotate Y, Rotate X, Rotate X-Rotate Y-Scale Z , 0 <br></br>
      Move X,	            Move Y,             Move Z ,           0
      </p>; 

       default:
         return <p></p>;
     }
}

function Welcome(props) {
  if (props.name == 45 ||props.name == 44||  props.name == 37 || props.name == 38  || props.name == 36 || props.name == 54 || props.name == 55   || props.name == 47|| props.name == 56 ){
    return <img src={images["A"+props.name+".gif"]}></img>;
  }
  else{
    return <img src={images["A"+props.name+".png"]}></img>;
  }

 
}


export default Mlarch;
