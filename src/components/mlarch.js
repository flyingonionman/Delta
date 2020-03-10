import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Carousel} from 'react-bootstrap';
import '../App.scss';
import autoprogetta from '../images/autoprogetta.jpg'; // Tell webpack this JS file uses this image
import bench00 from '../images/2Bench_00000.jpg'; // Tell webpack this JS file uses this image
import bench01 from '../images/2Bench_00001.jpg'; // Tell webpack this JS file uses this image
import bench02 from '../images/2Bench_00002.jpg'; // Tell webpack this JS file uses this image
import bench03 from '../images/2Bench_00003.jpg'; // Tell webpack this JS file uses this image
import bench04 from '../images/2Bench_00004.jpg'; // Tell webpack this JS file uses this image

import bench2 from '../images/example2.jpg'; // Tell webpack this JS file uses this image
import bench3 from '../images/example3.png'; // Tell webpack this JS file uses this image

import model1 from '../images/Diagram.png'; // Tell webpack this JS file uses this image
import model2 from '../images/model2.png'; // Tell webpack this JS file uses this image

import gif1 from '../images/train.gif'; // Tell webpack this JS file uses this image
import gif2 from '../images/latent.gif'; // Tell webpack this JS file uses this image

class Mlarch extends React.Component {
  render() {
  return (

    <div className="Mlarch" >    
        <div className="blog">
            <div className='App-header'>
                <h1>AI-progettazione : <br></br> AI-design </h1>

            </div>
            <div className='content'>
                <div className='contentblock'>
                  <h3>ENZO MARI </h3>
                  <img src = {autoprogetta}/>
                  <p>Enzo Mari “Autoprogettazione” published 1974</p>
                </div>
                <hr></hr>

                <div className='contentblock'>

                  <h3>
                    RENDER AS BENCH
                  </h3>

                  <Carousel>
                  <Carousel.Item>
                    <img src = {bench00}/>

                  </Carousel.Item>
                  <Carousel.Item>
                    <img src = {bench01}/>

                  </Carousel.Item>
                  <Carousel.Item>
                    <img src = {bench02}/>

                  </Carousel.Item>
                  <Carousel.Item>
                    <img src = {bench03}/>

                  </Carousel.Item>
                  <Carousel.Item>
                    <img src = {bench04}/>

                  </Carousel.Item>
                  </Carousel>
                  
                  <p>
                  Thousands of unique parametrically generated renders serve as the ground truth bench data set for the machine learning model.
                  </p>
                               <hr></hr>

                  <h3>SCRIBBLE AS BENCH</h3>
                  <img src = {bench2}/>
                  <p>
                    A 12 second MS Paint sketch tests the model’s accuracy.
                  </p>

                <hr></hr>
                <h3>Instructions</h3>
                <code>startseq cut a 4x 2”x4” at 42 inch b 2x 2”x4” at 18 inch c 2x 2”x4” at 20 inch d 3x 1”x6” at 20 inch endseq
                </code>

                <hr></hr>
                <h3>
                GENERATIVE MODEL
                </h3>
                <img src = {model1}/>
                <img src = {model2}/>

                <p>
                In summary : VGG19 + LSTM
                https://machinelearningmastery.com/develop-a-deep-learning-caption-generation-model-in-python/
                </p>
                
                <h3>
                  Code
                </h3>
            
                <code>
                https://github.com/flyingonionman/ML_ARCH
                </code>
                
                <hr></hr>

                

                <h3>GAN_WORK IN PROGRESS</h3>
                <img src = {bench3}/>

                <img src = {gif1}/>
                <img src = {gif2}/>

                </div>
                
                <hr></hr>

                <h3>Credits go to</h3>
                <p>Ariana Freitag</p>
                <p>Minyoung Na</p>
                <p>Jihoon Park</p>
                <p>Willem Smith-Clark</p>

            </div>

          </div>
      </div>    
 
    );
  }
}

export default Mlarch;
