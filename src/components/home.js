import React from 'react';
import '../css/main.scss';
import * as THREE from "three";
import { EffectComposer } from '../module/EffectComposer';
import { UnrealBloomPass  } from '../module/UnrealBloomPass';
import { RenderPass } from '../module/RenderPass';

import TWEEN from '@tweenjs/tween.js';

import Navbar from './assets/navbar'

//import SVG
function importAll(r) {
  let svgfiles = {};
  r.keys().map((item, index) => { svgfiles[item.replace('./', '')] = r(item); });
  return svgfiles;
}

const svgfiles = importAll(require.context('../svg', false, /\.(svg)$/));


//Globals
let camera, scene, renderer,controls,frameId,composer,raycaster,bloomPass;
const cube ={};
let scroll;
let tween;
let gzoom = false;
let selector // Determines which cube it spins
//Camera views

let zoomcontrol = false;

//Layering
let ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
let bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
      
let params_bloom  = {
  exposure: 1,
  bloomStrength: .7,
  bloomThreshold: 0,
  bloomRadius: 1.2
};


//mouse movement
var mouse = new THREE.Vector2()
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      zoomedin: zoomcontrol ,
      currproj: 0,
      
    };
  }

  /* 
  Initializers
  */
  componentDidMount(){
    //Animation + 3D object initialization
    this.init();


  }

  /* 
  Handles resizing of the window and resizes the 3D canvas automatically
  */
  handleWindowResize = () => {
    const width = window.innerWidth;
    const height =window.innerHeight;
    renderer.setSize(width, height)

  };


  /*  
  Handles scroll
  */
  handleScroll = (content) =>{
    scroll = content.scrollTop
    let hypercube = scene.getObjectByName('hypergroup', true)
    let elemcount = 0 ;
    /* 
    When scroll hits a certain point, then cubes explode ( Tween )
    
    */
    for (let child of hypercube.children){
      child.position.x+=.004 *  parseInt(elemcount%7);
      child.position.y +=.004 * ( parseInt(elemcount/7) -  parseInt(elemcount/49)* 7 );
      child.position.z +=.004 * parseInt(elemcount/49);
      elemcount +=1;

    }

    elemcount = 0;
  }

  
  init = () =>{
    var width = window.innerWidth
    var height = window.innerHeight;
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

    //Zoom in
    camera.position.z = 240
    camera.lookAt( new THREE.Vector3(0,0,0) );

    setTimeout(function(){
      tween = new TWEEN.Tween(camera.position)
      .to({ x: 14,y: 3 , z:45}, 1000) 
      .easing(TWEEN.Easing.Cubic.InOut
        )
      .start(); 
    } , 1000)

    
    
    // Lights
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

    //ADD RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    this.mount.appendChild(renderer.domElement)
    // SETUP hypercube
    var geometry = new THREE.BoxGeometry( .5, .5, .5 );
    const hypergroup = new THREE.Group();
    for ( var i = 0; i < 343; i ++ ) {
      var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:30,specular:0xffffff} );
      var hypercube = new THREE.Mesh( geometry, material );
      hypercube.position.x = i%7 ;
      hypercube.position.y = parseInt(i/7) -  parseInt(i/49) * 7 +2 ;
      hypercube.position.z = parseInt(i/49) * 1 + 1;
      hypercube.scale.setScalar( 2 );
      hypercube.material.emissive.setHSL( 0.1, 1, .1);

      hypergroup.add(hypercube)
    } 

    hypergroup.name = "hypergroup"
    scene.add( hypergroup );


    // SETUP BACKGROUND
    var geometry = new THREE.BoxGeometry( .5, .5, .5 );

    for ( var i = 0; i < 80; i ++ ) {
      var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:30,specular:0xffffff} );
      var sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = Math.random() * 80 - 50;
      sphere.position.y = Math.random() * 80 - 50;
      sphere.position.z = Math.random() * 80 - 100;
      sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
      sphere.material.emissive.setHSL( Math.random()*0.15 + .45, 1, Math.random()*0.4+.4);

      scene.add( sphere );
    } 



    //Set up window resize
    window.addEventListener('resize', this.handleWindowResize);
    var renderScene = new RenderPass( scene, camera );
    
    // Set up ray casting
    raycaster = new THREE.Raycaster();
    window.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'click', this.onclick, false );

    // postprocessing UNREALBLOOM

    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params_bloom.bloomThreshold;
    bloomPass.strength = params_bloom.bloomStrength;
    bloomPass.radius = params_bloom.bloomRadius;
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass ); 

    
    //Set up scrolling
    let content = document.querySelector(".content")
    content.addEventListener('scroll', ()=> this.handleScroll(content));


    // Start animation
    animstart();


  }

  // Handles cycling of panels within each section
  cycle = () =>{
    selector = 1;
    if (this.state.zoomedin) {
      selector = 1;
      if( this.state.currproj < 5){       this.setState({currproj: this.state.currproj+1})    }
      else{  this.setState({currproj: 0})  }
    } 
    if (Math.random() >.5){
      tween = new TWEEN.Tween( cube[selector].rotation)
      .to({ x:cube[selector].rotation.x+2}, 500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

      cube[selector].material.emissive.setHSL( Math.random()*.3+.1, .8, .15);
    }
    else{
      tween = new TWEEN.Tween( cube[selector].rotation)
      .to({ y:cube[selector].rotation.y+2}, 500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

      cube[selector].material.emissive.setHSL( Math.random()*.3, .8, .15);

    }
  }
  
  render() {
  return (

    <div className="App" >    
        <div id="canvas" ref={ref => (this.mount = ref)} />
        <div className="content">
          <div className="right">
            <h1> Minyoung Na</h1>
            <h2> Software developer</h2>
            <h3>
              Can we make the web not a place to visit but a place to experience? <br></br>
              I hope to accomplish this goal by building meaningful, aesthetic, and useful websites that enchant people.
            </h3>
          </div>
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
  let axis = new THREE.Vector3(3,4,4).normalize()
  let hypercube = scene.getObjectByName('hypergroup', true)
  if( 2000 - time%4000 > 0)   params_bloom.bloomStrength +=.0015;
  else {
    params_bloom.bloomStrength -=.0015;
  }
  //hypercube.rotateOnAxis(axis, 0.005)

  TWEEN.update();
  bloomPass.strength = params_bloom.bloomStrength;

  position(time);
  //controls.update();
  composer.render();
  frameId = requestAnimationFrame(animate)
}

function position(time){
  raycaster.setFromCamera( mouse, camera );
 
}

function onDocumentMouseMove( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function Projectlist(props) {
  switch ( props.name) { 
  case "pied":
    return <div>
      <h1>Pied Paper, ML based news aggregator.</h1>
      <p>
        Our project is a truth-based news aggregator. With the rise of smaller, internet-based news publications, and political value in controlling 
        the spread of information, fake news has become a genuine problem. Pied Paper seeks to provide a clearer view of online news, using 
        real news articles scraped from the web. Our website aggregates news from various media sites, and uses a PyTorch-based neural net 
        model to classify articles as fake or real. This model is trained on a fake/real news dataset obtained from Kaggle. 
        The model’s prediction is shown to the user, and user input is also taken to measure users’ agreement with the model. Articles can be sorted by genre and date.
      </p>
      </div>;
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
      <p>Creating simple but effective visualization for the purpose of helping the bail project. The current bail system was shaped 
        under the Bail Reform Act of 1966 when the political climate favored the detention of all defendants.
        The bail system has been viewed negatively by the public as it can exploit minorities and the poor. 
        One of our initial goals was to build an ontology given these datasets, and to that end categorizing the disparate State-level penal codes 
        into a National scheme such that we can draw comparisons across states in a more consistent manner. This is one of the attempts
        to visually represent that ontology.

      </p>
      </div>;
  case "unionjrnl":
    return <div>
      <h1>UNION web journal design </h1>
      <p>UNION is an interdisciplinary journal for art and literature run by the students of The Cooper Union. 
        I Collaborated with artists on a web page for our first digital only issue.
           IUsed HTML and JQuery to transform static images into an interactive webpage.
      </p>
      </div>;
  case "babymon":
    return <div>
      <h1>Baby monitoring device project</h1>
      <p>Our project is a home automation system that detects a baby’s motion in a crib, and sends notifications to 
        the guardians' phones when the baby is about to crawl out. Raspberry Pi, connected to the camera, upon 
        detecting motion of a baby that’s large enough to be interpreted as an irregularity ( baby stepped out of the 
        crib, is shaking, etc.), would notify an app installed on a smartphone. The user will have an option to 
        respond to the alarm on the phone and view the baby through the phone. If the user sees that it was a 
        false alarm, they can simply turn off the notification on the app. Users will be able to access the 
        stream at any time and change options according to their needs.
      </p>
      </div>;
  case "dropblocks":
    return <div>
      <h1>Drop Blocks</h1>
      <p>Implemented Dropblocks in resnet-50 according to <a href="https://arxiv.org/abs/1810.12890">[this article]</a>. 
      </p>
      </div>;
  default:
    return 0
  }
}



export default Home;
