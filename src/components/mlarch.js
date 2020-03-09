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

                <pre>
                def define_model(vocab_size, max_length): 
                  # feature extractor model
                  inputs1 = Input(shape=(4096,))
                  fe1 = Dropout(0.5)(inputs1)
                  fe2 = Dense(256, activation='relu')(fe1)
                  # sequence model
                  inputs2 = Input(shape=(max_length,))
                  se1 = Embedding(vocab_size, 256, mask_zero=True)(inputs2)
                  se2 = Dropout(0.5)(se1)
                  se3 = LSTM(256)(se2)
                  # decoder model
                  decoder1 = add([fe2, se3])
                  decoder2 = Dense(256, activation='relu')(decoder1)
                  outputs = Dense(vocab_size, activation='softmax')(decoder2)
                  # tie it together [image, seq] [word]
                  model = Model(inputs=[inputs1, inputs2], outputs=outputs)
                  # compile model
                  model.compile(loss='categorical_crossentropy', optimizer='adam')
                  # summarize model
                  model.summary()
                  return model
                </pre>

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
