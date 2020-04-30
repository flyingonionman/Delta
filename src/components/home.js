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
var gzoom = false;
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
    this.state = { 
      zoomedin: false ,
    };
  }
  componentDidMount(){
    this.init();
    animstart();
  }

  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height)

  };

  return = () =>{
    tween = new TWEEN.Tween(camera.position)
      .to({ x: 0 ,y:0 , z:35}, 1500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 

      tween = new TWEEN.Tween(camera.rotation)
      .to({ y:0 }, 1500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 

    this.setState({ zoomedin: false });
    gzoom = false;
  }

  onclick = (event) =>{
    event.preventDefault();
    var important = [scene.children[1],scene.children[2]]
    var intersects = raycaster.intersectObjects(  important );
  
    if ( intersects.length > 0 ) {
      var id = intersects[0].object.name
  
      switch (id){
        case "projects" :{
        gzoom = true;
        this.setState({ zoomedin: true });
        tween = new TWEEN.Tween(camera.position)
        .to({ x: -13 ,y:1 , z:17}, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start(); 
  
        tween = new TWEEN.Tween(camera.rotation)
        .to({ y:-1 }, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start(); 
       
  
        tween = new TWEEN.Tween(cube[1].rotation)
        .to({ y:.5,x:0,z:0}, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start(); 
        }
     
        default:
          break;
      }
      
    } 
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
    camera.position.z = 35
    camera.lookAt( new THREE.Vector3(0,0,0) );

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
    //controls = new OrbitControls(camera,renderer.domElement );
    //controls.update();

    //ADD CUBE 
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
    var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );
    var material2 = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[1].material.emissive.setHSL( .1, .8, .2);

    cube[2] = new THREE.Mesh( geometry2, material2 );

    cube[1].position.y = 1;
    cube[2].position.x = -20;
    cube[1].name = "projects";
    cube[2].name = "about";


    scene.add(cube[1]);

    scene.add(cube[2]);
    window.addEventListener('resize', this.handleWindowResize);
    
    var renderScene = new RenderPass( scene, camera );
    
    // SETUP BACKGROUND
    var geometry = new THREE.BoxGeometry( .5, .5, .5 );

    for ( var i = 0; i < 80; i ++ ) {

      var color = new THREE.Color();

      var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:30,specular:0xffffff} );
      var sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = Math.random() * 100 - 50;
      sphere.position.y = Math.random() * 100 - 50;
      sphere.position.z = Math.random() * 100 - 100;
      sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
      sphere.material.emissive.setHSL( Math.random()*0.15 + .45, 1, Math.random()*0.4+.4);

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
    window.addEventListener( 'click', this.onclick, false );

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
        <li><a href="#contact">//A MINYOUNG NA WORKS//</a></li>
        <li><a href="#about">//WEBSITE CURRENTLY UNDER CONSTRUCTION//</a></li>
      </ul>

      </div>
      <div className="content">
        <div id="canvas" ref={ref => (this.mount = ref)} />
        {/* <div className="label" >PROJECTS</div> */}

        <container className={  this.state.zoomedin ? 'projectappear': 'hidden'}>
          <Projectlist name="mlarch"></Projectlist>
        </container> 

        <button id="return" onClick={this.return}  >return</button>

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

  if (!gzoom){
    for (let property in cube) {
      cube[property].rotation.x += .01;
      cube[property].rotation.y += .01;  

    };
  }
  camera.rotation.y -= .00001;  
  TWEEN.update();

  position(time);
  //controls.update();
  composer.render();
  frameId = requestAnimationFrame(animate)
}

function position(time){
  raycaster.setFromCamera( mouse, camera );
  var important = [scene.children[1],scene.children[2]]

  var intersects = raycaster.intersectObjects(  important );

  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xadd8e6);
      
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




function Projectlist(props) {
  switch ( props.name) { 
  case "mlarch":
    return <div>
      <h1>Machine learning with architecture</h1>
      <hr></hr>
      <p>Can we generate instructions based on simple sketches? Inspired by Enzo Mari's work, we combined machine learning and 
      architecture to create a system in which you can obtain model files from a png image. We are also using GAN to generate 
      monstrous furnitures that can be plugged back into the model to see how we would actually construct it.
      </p>
      <button onClick={transition}  id="tomlarch">To galaxy MLARCH</button>
      </div>;
  default:
    return 
  }
}
 
function transition(){
  console.log("pogger")
  camera.rotation.y = 0;
  tween = new TWEEN.Tween(camera.position)
  .to({ y:0,x:0,z:1000}, 3000) 
  .easing(TWEEN.Easing.Quadratic.Out)
  .start(); 
  
    setTimeout(function(){   window.location = 'mlarch'; }, 3000);

}

export default Home;
