import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import autoprogetta from '../images/autoprogetta.jpg'; // Tell webpack this JS file uses this image
import bench from '../images/2Bench_00000.jpg'; // Tell webpack this JS file uses this image
import bench2 from '../images/example2.jpg'; // Tell webpack this JS file uses this image

import model1 from '../images/model1.png'; // Tell webpack this JS file uses this image
import model2 from '../images/model2.png'; // Tell webpack this JS file uses this image

class Mlarch extends React.Component {
  render() {
  return (

    <div className="Mlarch" >    
        <div className="blog">
            <div className='App-header'>
                <h1>Autoprogettazione : "Self-design" </h1>

            </div>
            <div className='content'>
                <div className='contentblock'>
                  <h3> Who is Enzo Mari </h3>
                  <img src = {autoprogetta}/>
                  <p> a good person obviously</p>

                </div>

                <div className='contentblock'>
                  <h3>
                    Bench is a bench
                  </h3>
                  <img src = {bench}/>
                  
                  <p>
                    Grasshopper bench
                  </p>
               
                  <h3>Bench is not a bench</h3>
                  <img src = {bench2}/>
                  <p>
                    MS paint bench
                  </p>

                <hr></hr>
                <h3>
                  How does it work?
                </h3>
                <img src = {model1}/>
                <img src = {model2}/>

                <p>
                https://machinelearningmastery.com/develop-a-deep-learning-caption-generation-model-in-python/
                </p>
                
                <h3>
                  Coooode
                </h3>
            
                <code>
                https://github.com/flyingonionman/ML_ARCH
                </code>
                
                <h3>Instructions ?</h3>
                <code>startseq cut a four x two ”x four ” at thirty eight inch b two x two ”x four ” at thirty six inch c two x two ”x four ” at thirty nine inch d six x one ”x six ” at thirty eight inch endseq
                </code>
                </div>
                
            </div>

          </div>
      </div>    
 
    );
  }
}

export default Mlarch;
