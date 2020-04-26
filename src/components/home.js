import React from 'react';
import '../css/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as THREE from "three";
import { EffectComposer } from '../module/EffectComposer';
import { UnrealBloomPass  } from '../module/UnrealBloomPass';
import { RenderPass } from '../module/RenderPass';

import { OrbitControls } from '../module/OrbitControls';

//Globals
var camera, scene, renderer,controls,frameId,composer;
const cube ={};

var afterimagePass;

//Layering
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
      
var params_bloom  = {
  exposure: 1.1,
  bloomStrength: 10,
  bloomThreshold: 0,
  bloomRadius: 1
};

//text

class Home extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.init();
    start();
  }

  init = () =>{
    var width = window.innerWidth
    var height = window.innerHeight
    //ADD SCENE
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000000  );

    //ADD CAMERA
    camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      1,
      1000
    )
    camera.position.z = 25

    // Lights
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

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

    //ADD CUBE 
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
    var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:10,specular:0x00ff00} );
    var material2 = new THREE.MeshPhongMaterial( {color: 0x3FD0D0, shininess:10,specular:0x00ff00} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[2] = new THREE.Mesh( geometry2, material2 );

    cube[1].position.y = 1;
    cube[2].position.x = -8;

    scene.add(cube[1]);

    scene.add(cube[2]);
    window.addEventListener('resize', this.handleWindowResize);
    
    var renderScene = new RenderPass( scene, camera );
    
    // SETUP BACKGROUND
    /* var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    for ( var i = 0; i < 100; i ++ ) {

      var color = new THREE.Color();
      color.setHSL( Math.random()*0.15 + .55, .5, Math.random()*0.2);

      var material = new THREE.MeshBasicMaterial( { color: color } );
      var sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = Math.random() * 150 - 75;
      sphere.position.y = Math.random() * 150 - 50;
      sphere.position.z = Math.random() * 10 - 100;
      sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
      scene.add( sphere );

      if ( Math.random() < 0.25 ) sphere.layers.enable( BLOOM_SCENE );

    } */
    // Adding labels
    /* var loader = new THREE.FontLoader();

    loader.load( '../font/Bahnschrift_Regular.json', function ( font ) {

      var textgeo = new THREE.TextGeometry( 'Projects', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
      geometry = new THREE.BufferGeometry().fromGeometry( textgeo );
      textMesh = new THREE.Mesh( geometry, text_materials );
      console.log(geometry);

      textMesh.position.x = 0 ;      textMesh.position.y = 0 ;      textMesh.position.z = 0 ;
      scene.add(textMesh);
    } ); */


    // postprocessing UNREALBLOOM

    var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params_bloom.bloomThreshold;
    bloomPass.strength = params_bloom.bloomStrength;
    bloomPass.radius = params_bloom.bloomRadius;
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );


  }
  
  render() {
  return (

    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">//WEBSITE CURRENTLY UNDER CONSTRUCTION//</a></li>
      </ul>

      </div>
      <div className="content">
        <div id="canvas" ref={ref => (this.mount = ref)} />
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

function animate () {

  for (let property in cube) {
    cube[property].rotation.x += .01;
    cube[property].rotation.y += .01;  

  };

  camera.position.x += .001;

  controls.update();
  composer.render();
  frameId = window.requestAnimationFrame(animate)
}

export default Home;
