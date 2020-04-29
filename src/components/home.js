import React from 'react';
import '../css/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as THREE from "three";
import { EffectComposer } from '../module/EffectComposer';
import { UnrealBloomPass  } from '../module/UnrealBloomPass';
import { RenderPass } from '../module/RenderPass';

import { OrbitControls } from '../module/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

import { Interaction } from 'three.interaction';

function importAll(r) {
  let fontfiles = {};
  r.keys().map((item, index) => { fontfiles[item.replace('./', '')] = r(item); });
  return fontfiles;
}

const fontfiles = importAll(require.context('../font', false, /\.(json)$/));

//Globals
var camera, scene, renderer,controls,frameId,composer,raycaster;
const cube ={};
var tween;

//Camera views
var project = false;
var afterimagePass;

//Layering
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
      
var params_bloom  = {
  exposure: 1,
  bloomStrength: 1.2,
  bloomThreshold: 0,
  bloomRadius: 1
};

//text
var text_materials, textMesh;

//mouse movement
var mouse = new THREE.Vector2(), INTERSECTED;
class Home extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.init();
    animstart();
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

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );
    var material2 = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[2] = new THREE.Mesh( geometry2, material2 );

    cube[1].position.y = 1;
    cube[2].position.x = -8;
    cube[1].name = "projects";


    scene.add(cube[1]);

    scene.add(cube[2]);
    window.addEventListener('resize', this.handleWindowResize);
    
    var renderScene = new RenderPass( scene, camera );
    
    // SETUP BACKGROUND
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    for ( var i = 0; i < 40; i ++ ) {

      var color = new THREE.Color();

      var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:30,specular:0xffffff} );
      var sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = Math.random() * 150 - 75;
      sphere.position.y = Math.random() * 150 - 50;
      sphere.position.z = Math.random() * 10 - 50;
      sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
      sphere.material.emissive.setHSL( Math.random()*0.15 + .45, 1, Math.random()*0.4+.1);

      scene.add( sphere );
    } 

    //
    // Adding labels
    /* var loader = new THREE.FontLoader();

    loader.load( fontfiles['default.json'], function ( font ) {
      text_materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
      ];


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

      textMesh.position.x = 0 ;      textMesh.position.y = 0 ;      textMesh.position.z = 0 ;
      scene.add(textMesh);
    } );  */
    //
    const interaction = new Interaction(renderer, scene, camera);

    // Set up ray casting
    raycaster = new THREE.Raycaster();
    window.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'click', onclick, false );

    // postprocessing UNREALBLOOM

    var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params_bloom.bloomThreshold;
    bloomPass.strength = params_bloom.bloomStrength;
    bloomPass.radius = params_bloom.bloomRadius;
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass ); 

    //cube interaction
   
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
        <div className="label" >PROJECTS</div>
      </div>    
       
    </div>
    );
  }
}

function animstart () {
  if (!frameId) {
    frameId = requestAnimationFrame(animate)
  }
}

function animate (time) {

  for (let property in cube) {
    cube[property].rotation.x += .01;
    cube[property].rotation.y += .01;  

  };
  camera.position.x += .001;  

  position(time);
  controls.update();
  composer.render();
  frameId = requestAnimationFrame(animate)
}

function position(time){
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(  scene.children );
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {

      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xadd8e6);

  
    }
    else{
      if(tween) tween.update(time)
    }

  } else {

    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

    INTERSECTED = null;

  }
}

function onDocumentMouseMove( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onclick (event){
  event.preventDefault();
  var intersects = raycaster.intersectObjects(  scene.children );
  if ( intersects.length > 0 ) {
    tween = new TWEEN.Tween(camera.position) // Create a new tween that modifies 'coords'.
    .to({ x: 100 ,y:100 }, 2000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .start(); // Start the tween immediately.
  } else {
  }
}


export default Home;
