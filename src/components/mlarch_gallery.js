import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/gallery.scss';
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { Container, Row, Col } from 'react-bootstrap';



function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });

  return images;
}


const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));


class Mlarch extends React.Component {
  componentDidMount(){
    this.init();
  }
  
  
  
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
    this.setState({ chosenimg: number });
  }


  render() {
    return (
      <div className ="gallery">
        <Container fluid> 
          <Row>
            <Col><img  onClick={() => this.enlarge(1)} src={images["p"+1+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(2)} src={images["p"+2+".png"]}/></Col>
            <Col><img onClick={() => this.enlarge(3)} src={images["p"+3+".png"]}/></Col>
            <Col><img  onClick={() => this.enlarge(4)}src={images["p"+4+".png"]}/></Col>
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
            <button  onClick={this.enlarge}  >return</button>
          </p>

        </div>
        
        <div className={  this.state.isActive ? 'blurb': 'hidden-right'}> 
            <p className={"description"}>
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
             totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
             dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
             sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, 
             qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
             incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum 
             exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
             Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"


          </p>

        </div>
      </div>
    );
  }
}

function Welcome(props) {
  return <img src={images["p"+props.name+".png"]}></img>;
}


export default Mlarch;
