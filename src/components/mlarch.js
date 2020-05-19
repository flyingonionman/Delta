import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  Link
} from "react-router-dom";
import { STLLoader } from '../stl/STLLoader.js';
import { STLExporter } from '../stl/STLexporter.js';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

import * as THREE from "three";
import { OrbitControls } from '../module/OrbitControls';
import * as benchimg  from '../images/example.png'

function importAll(r) {
  let stlfiles = {};
  r.keys().map((item, index) => { stlfiles[item.replace('./', '')] = r(item); });
  return stlfiles;
}

const stlfiles = importAll(require.context('../stl', false, /\.(stl)$/));
const { createCanvas, loadImage } = require('canvas')

//machine learning model
const model = tf.loadLayersModel('https://raw.githubusercontent.com/flyingonionman/Delta/master/src/models/model.json');

//Drawing relatted

var canvas;
var ctx;
var testimg;
//Threejs Globals
var camera, scene, renderer,controls;
var bench;
var frameId;
var link ;
var exporter = new STLExporter();



class Mlarch extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.init();
    /* this.drawing(); */
  }

  /* drawing = () =>{
    canvas = this.refs.canvas
    ctx = canvas.getContext("2d")
    testimg = new Image()
    testimg.crossOrigin = "anonymous";
    testimg.src = benchimg
    testimg.onload = () => {
      ctx.drawImage(testimg, 0, 0)
    }
  } */

  init = () =>{
    var loader = new STLLoader()
    var width = window.innerWidth
    var height = window.innerHeight
    //ADD SCENE

    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x949292  );
    scene.fog = new THREE.Fog( 0x152238 , 4, 15 );

    // Ground

    var plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 40, 40 ),
      new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    scene.add( plane );

    plane.receiveShadow = true;

    //ADD CAMERA
    camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      1,
      1000
    )
    camera.position.z = 12

    // Lights
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    this.addShadowedLight( 1, 1, 1, 0x000000,5 );
    this.addShadowedLight( 0.5, 1, - 1, 0x00aaff, .51 );

    //ADD RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    this.mount.appendChild(renderer.domElement)

    //ADD CONTROLS
    controls = new OrbitControls(camera,renderer.domElement );
    controls.update();

    

    // GRID
    var size = 20,
    step = 0.25;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial(
    {
        color: 0xFFFFFF
    });
    for (var i = -size; i <= size; i += step)
    {
        geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
        geometry.vertices.push(new THREE.Vector3(size, -0.04, i));
        geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
        geometry.vertices.push(new THREE.Vector3(i, -0.04, size));
    }
    var line = new THREE.Line(geometry, material, THREE.LinePieces);
    line.position.y = -0.46;
    scene.add(line);

    //ADD BENCH 
    //LOAD as ASCII
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0x111111, shininess: 300 } );

    loader.load( stlfiles['Bench.stl'], function ( geometry ) {
      geometry.applyMatrix( new THREE.Matrix4().makeTranslation(20, 32, -20) );

      bench = new THREE.Mesh( geometry, material );
      bench.scale.set( 0.05,  0.05, 0.05 );
      bench.rotation.x = 45;
      
      bench.position.x = -8 ;
      bench.position.y = .8 ;
      bench.position.z = 0 ;

      bench.castShadow = true;
      bench.receiveShadow = true;
      scene.add( bench );
      console.log( bench)
      start();
    } );  


    //ADD SLIDER
    var slider = document.getElementById("slider");
    slider.addEventListener("input", resize);
    
    var slider2 = document.getElementById("slider2");
    slider2.addEventListener("input", resizey);

    scene.add(this.cube);
    window.addEventListener('resize', this.handleWindowResize);

    //ADD LINK DOWNLOAD
    link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link );

  }
 

  addShadowedLight = ( x, y, z, color, intensity ) =>{

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    var d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

  }

  
  stop = () => {
      cancelAnimationFrame(frameId)
  }
 
  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height)

  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('input', this.resize);

  }

  render() {
  return (

    <div className="Mlarch_intro" >    
          <div id="c" ref={ref => (this.mount = ref)} />
          <input className="controller" type="range" min="0" max="10" step="0.1" id="slider" orient="vertical" />
          <input className="controller" type="range" min="0" max="10" step="0.1" id="slider2" orient="vertical" />
{/*           <canvas id="canvas" ref="canvas" width={224} height={224} />
 */}
          <div id="info-body">
          <h1>AI-progettazione</h1>
          <h3>Move around ! </h3>

          <p>Can we generate instructions based on simple sketches? Inspired by Enzo Mari's work, we combined machine learning and architecture
            to create a system in which you can obtain model files from a png image. We are also using GAN to generate monstrous furnitures that
            can be plugged back into the model to see how we would actually construct it.
          </p>  
          <button type="button"><Link  style={{ textDecoration: 'none' , color:'black'}} to="/mlarch_gallery">To gallery</Link></button>
          <button type="button " id="downloadSTL" onClick={exportBinary}style={{ textDecoration: 'none' , color:'black'}}>Download STL</button>
         <button type="button " id="startmodel" onClick={extract_features}style={{ textDecoration: 'none' , color:'black'}}>Start Training</button>
 
            <div id="credits">
              <h3>Credits go to</h3>
              <h4>Students :</h4>
              <p>Ariana Freitag, EE'20 | Minyoung Na, BSE'20 | Jihoon Park, ARCH'21 | Willem Smith-Clark, ARCH'21</p>
              <h4>Advisors :</h4>
              <p>Sam Keene, Professor of Electrical Engineering | Ben Aranda, Assistant professor of Architecture  </p>

              <hr></hr>
              <h3><a href="https://www.instagram.com/machine_learning_architecture/">ML + ARCH @ Cooper Union [instagram link]</a></h3>
            </div>
          
          </div>
         
      </div>    
 
    );
  }
}

function start () {

  if (!frameId) {
    frameId = requestAnimationFrame(animate)
  }
}

function renderScene () {
  renderer.render(scene, camera)
}

function animate () {

  controls.update();
  bench.rotation.x += 0.01;
  //bench.rotation.z += 0.01;

  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function resize (e) {
  var target = (e.target) ? e.target : e.srcElement;
  bench.scale.x = target.value/100; 
  //bench.position.x = target.value/100 -8
}

function resizey (e) {
  var target = (e.target) ? e.target : e.srcElement;
  bench.scale.y = target.value/100;
  bench.position.y = target.value/100  
}

function exportBinary() {
  var result = exporter.parse( bench, { binary: true } );
  saveArrayBuffer( result, 'bench.stl' );

}

function saveArrayBuffer ( buffer, filename ){

  save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

}

function save ( blob, filename )  {

  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();

}

function extract_features(){
  const verbose = true
  
  let tensor = tf.browser.fromPixels(canvas)
      .toFloat();
    tensor.print(verbose=true)
  }

/* def generate_desc(model, tokenizer, photo, max_length):
    # seed the generation process
    in_text = 'startseq'
    # iterate over the whole length of the sequence
    for i in range(max_length):
        # integer encode input sequence
        sequence = tokenizer.texts_to_sequences([in_text])[0]
        # pad input
        sequence = pad_sequences([sequence], maxlen=max_length)
        # predict next word
        yhat = model.predict([photo,sequence], verbose=0)
        # convert probability to integer
        yhat = argmax(yhat)
        # map integer to word
        word = word_for_id(yhat, tokenizer)
        # stop if we cannot map the word
        if word is None:
            break
        # append as input for generating the next word
        in_text += ' ' + word
        # stop if we predict the end of the sequence
        if word == 'endseq':
            break
    return in_text */



export default Mlarch;
