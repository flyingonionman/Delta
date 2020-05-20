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
var tween1, tween2;
var gzoom = false;

var project_list =["mlarch","datasci","unionjrnl","babymon","dropblocks"]
var about_list = ["about_me","about_school"]
//Camera views
var project = false;
var afterimagePass;

var zoomcontrol = false;

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
      zoomedin: zoomcontrol ,
      zoomedin_about: zoomcontrol ,
      currabout:0,
      currproj: 0
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
    
      cube[1].material.emissive.setHSL( .1, .8, .2);

    this.setState({ zoomedin: false , zoomedin_about:false });
    gzoom = false;
  }

  onclick = (event) =>{
    event.preventDefault();
    var important = [scene.children[1],scene.children[2]]
    var intersects = raycaster.intersectObjects(  important );
  
    if ( intersects.length > 0 ) {
      var id = intersects[0].object.name
      console.log(id)
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
       
  
        
        break;
        }
        case "about" :{
          gzoom = true;
          this.setState({ zoomedin_about: true });
          tween = new TWEEN.Tween(camera.position)
          .to({ x: -2 ,y:0 , z:12}, 1500) 
          .easing(TWEEN.Easing.Quadratic.Out)
          .start(); 
          
          tween = new TWEEN.Tween(camera.rotation)
          .to({ y:1 }, 1500) 
          .easing(TWEEN.Easing.Quadratic.Out)
          .start(); 
         
    
        
          break;

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
    var geometry2 = new THREE.BoxGeometry( 3, 3, 3 );

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );
    var material2 = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[1].material.emissive.setHSL( .1, .8, .2);

    cube[2] = new THREE.Mesh( geometry2, material2 );
    cube[2].material.emissive.setHSL( .4, .8, .1);

    cube[1].position.y = 1;
    cube[2].position.x = -12;
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

  cycle = () =>{
    if( this.state.currproj < 4){
      this.setState({currproj: this.state.currproj+1})

    }
    else{
      this.setState({currproj: 0})
    }

    if (Math.random() >.5){
      tween = new TWEEN.Tween( cube[1].rotation)
      .to({ x:cube[1].rotation.x+2}, 500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

      cube[1].material.emissive.setHSL( Math.random()*.3+.1, .8, .15);

    }
    else{
      tween = new TWEEN.Tween( cube[1].rotation)
      .to({ y:cube[1].rotation.y+2}, 500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

      cube[1].material.emissive.setHSL( Math.random()*.3, .8, .15);

    }
  }
  
  render() {
  return (

    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a href="#contact">//A MINYOUNG NA WORKS//</a></li>
        <li><a href="#about">WEBSITE CURRENTLY UNDER CONSTRUCTION</a></li>
      </ul>

      </div>
      <div className="content">
        <div id="canvas" ref={ref => (this.mount = ref)} />
        {/* <div className="label" >PROJECTS</div> */}

        <container className={  this.state.zoomedin ? 'projectappear': 'hidden_right'}>
          <Projectlist name={project_list[this.state.currproj]}></Projectlist>
          <button id="cycle" onClick={this.cycle}> Next</button>
          <button onClick={() => transition("mlarch")}  id="tomlarch">To MLARCH</button>
          {/* Have the buttons go here so that I can make descriptions dissapear when they are clicked */}

        </container> 

        <container className={  this.state.zoomedin_about ? 'aboutappear': 'hidden_left'}>
          <Aboutlist name={about_list[this.state.currabout]}></Aboutlist>
          <button id="cycle" onClick={this.cycle}> Next</button>

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
      <p>Can we generate instructions based on simple sketches? Inspired by Enzo Mari's work, we combined machine learning and 
      architecture to create a system in which you can obtain model files from a png image. We are also using GAN to generate 
      monstrous furnitures that can be plugged back into the model to see how we would actually construct it.
      </p>
      </div>;
  case "datasci":
    return <div>
      <h1>Data science for social good</h1>
      <p>Creating simple but effective visualization for the purpose of helping the bail project.
      </p>
      <button onClick={() => transition("datasci")}  id="tomlarch">To Datasci </button>
      </div>;
  case "unionjrnl":
    return <div>
      <h1>UNION web journal design </h1>
      <p>Helped artists
      </p>
      <button onClick={() => transition("unionjrnl")}  id="tomlarch">To UNION journal </button>
      </div>;
  case "babymon":
    return <div>
      <h1>Baby monitoring device project</h1>
      <p>Done as a part of my senior engineering projects.
      </p>
      <button onClick={() => transition("babymon")}  id="tomlarch">To Baby monitor </button>
      </div>;
  case "dropblocks":
    return <div>
      <h1>Drop Blocks</h1>
      <p>Implemented Dropblocks in resnet-50 according to <a href="https://arxiv.org/abs/1810.12890">this article</a>. 
      <a href="https://github.com/ArianaFreitag/cgml-midterm">Source code</a>.
      </p>
      <button onClick={() => transition("dropblocks")}  id="tomlarch">To Drop blocks </button>
      </div>;
  default:
    return 0
  }
}

function Aboutlist(props) {
  switch ( props.name) { 
  case "about_me":
    return <div>
      <h1>Who am I?</h1>
      <p>
      I am Minyoung Na
      </p>
      <button onClick={() => transition("mlarch")}  id="tomlarch">To MLARCH</button>
      </div>;
  case "about_school":
    return <div>
      <h1>Curriculum</h1>
      <p>Creating simple but effective visualization for the purpose of helping the bail project.
      </p>
      <button onClick={() => transition("datasci")}  id="tomlarch">To Datasci </button>
      </div>;

  default:
    return 0
  }
}

 
function transition(pageurl){
  zoomcontrol = true;

  tween1 = new TWEEN.Tween(camera.position)
  .to({ y:0,x:0,z: 200}, 2000) 
  .easing(TWEEN.Easing.Quadratic.Out)

  tween2 = new TWEEN.Tween(camera.position)
  .to({ y:0,x:0,z:2.3}, 1000) 
  .easing(TWEEN.Easing.Quadratic.Out)

  tween = new TWEEN.Tween(camera.rotation)
  .to({ y:0 }, 2000) 
  .easing(TWEEN.Easing.Quadratic.Out)
  .start(); 

  tween1.chain(tween2)
  
  tween1.start();

  setTimeout(function(){   window.location = pageurl; }, 3000);

}

export default Home;
