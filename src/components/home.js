import React from 'react';
import '../css/main.scss';
import * as THREE from "three";
import { EffectComposer } from '../module/EffectComposer';
import { UnrealBloomPass  } from '../module/UnrealBloomPass';
import { RenderPass } from '../module/RenderPass';
import { SVGLoader } from '../svg/SVGLoader.js';

import { OrbitControls } from '../module/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

import { Interaction } from 'three.interaction';
//import SVG
function importAll(r) {
  let svgfiles = {};
  r.keys().map((item, index) => { svgfiles[item.replace('./', '')] = r(item); });
  return svgfiles;
}

const svgfiles = importAll(require.context('../svg', false, /\.(svg)$/));


//Globals
var camera, scene, renderer,controls,frameId,composer,raycaster;
const cube ={};
var tween;
var tween1, tween2;
var gzoom = false;
var selector // Determines which cube it spins
var project_list =["pied","mlarch","datasci","unionjrnl","babymon","dropblocks"]
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
  bloomStrength: .7,
  bloomThreshold: 0,
  bloomRadius: 1.2
};

//Prelim data for svg
var guiData = {
  currentURL: 'src/svg/Seminopoly.svg',
  drawFillShapes: true,
  drawStrokes: true,
  fillShapesWireframe: false,
  strokesWireframe: false
};


//mouse movement
var mouse = new THREE.Vector2(), INTERSECTED;
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      zoomedin: zoomcontrol ,
      currproj: 0,
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
      .to({ x:0 ,y:0 , z:37}, 1000) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 

      tween = new TWEEN.Tween(camera.rotation)
      .to({ x:0,y:0,z:0 }, 1000) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 
    
      cube[1].material.emissive.setHSL( .1, .8, .2);

    this.setState({ zoomedin: false });
    gzoom = false;
  }

  onclick = (event) =>{
    event.preventDefault();
    var important = [scene.children[1],scene.children[2],scene.children[3]]
    var intersects = raycaster.intersectObjects(  important );
  
    if ( intersects.length > 0 ) {
      var id = intersects[0].object.name
      gzoom = true;
      this.setState({ zoomedin: true });
      tween = new TWEEN.Tween(camera.position)
      .to({ x: -3 ,y:3 , z:15}, 800) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 

      tween = new TWEEN.Tween(camera.rotation)
      .to({ x:.1,y:-.4,z:0}, 800) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .start(); 
        
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

    //Zoom in
    camera.position.z = 240
    camera.lookAt( new THREE.Vector3(0,0,0) );

    setTimeout(function(){
      tween = new TWEEN.Tween(camera.position)
      .to({ x: 0 ,y: 0 , z:37}, 1000) 
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

    //ADD CONTROLS
    /* controls = new OrbitControls(camera,renderer.domElement );
    controls.update(); */

    //ADD CUBE 
    //Create cube by using BoxGeometry.
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[1].material.emissive.setHSL( .1, .8, .2);
    cube[1].position.y = 4.25;
    cube[1].name = "projects";


    scene.add(cube[1]);

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

    var banner_project  ={      x:-7,      y:9,      z:.2    }

    var project =svgfiles['main_projects.svg']
    loadSVG(project,banner_project);


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
  
  transition = (pageurl) =>{
    if (pageurl == "dropblocks") {  window.open( "https://github.com/ArianaFreitag/cgml-midterm", '_blank') ;  return; }
    if (pageurl == "unionjrnl") {    window.open(  "http://unionjournal.space/", '_blank' ) ; return;  }


    zoomcontrol = true;
    this.setState({ zoomedin: false , zoomedin_about:false});
    gzoom = false;
  
    tween1 = new TWEEN.Tween(camera.position)
    .to({ y:0,x:0,z: 200}, 2000) 
    .easing(TWEEN.Easing.Quadratic.Out)
  
    tween2 = new TWEEN.Tween(camera.position)
    .to({ y:4,x:0,z:2.9}, 1000) 
    .easing(TWEEN.Easing.Quadratic.Out)
  
    tween = new TWEEN.Tween(camera.rotation)
    .to({ x:0,y:0,z:0 }, 2000) 
    .easing(TWEEN.Easing.Quadratic.Out)
    .start(); 
  
    tween1.chain(tween2)
    
    tween1.start();
    if (pageurl == "pied") {       setTimeout(function(){   window.location.href = "https://www.piedpaper.net";  }, 3000);  }
    if (pageurl == "babymon") {       setTimeout(function(){   window.location.href = "https://www.youtube.com/watch?v=ycRHIYA70sg";  }, 3000);  }
    if (pageurl == "mlarch") {     setTimeout(function(){   window.location.href = "https://www.minyoungna.com/mlarch";  }, 3000);  }
    if (pageurl == "datasci") {      setTimeout(function(){   window.location.href = "https://www.minyoungna.com/datasci";  }, 3000);  }
    if (pageurl == "soundcloud") {   setTimeout(function(){   window.location.href = "https://soundcloud.com/fantalone";  }, 3000);  }
    if (pageurl == "graphicdesign") {   setTimeout(function(){   window.location.href = "https://github.com/flyingonionman/Design-Portfolio";  }, 3000);  }

  }
  
  render() {
  return (

    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a>MINYOUNG NA // minyoungwork1997@gmail.com //</a><a href="https://www.minyoungna.com">Return Home</a></li>
      </ul>

      </div>
      <div className="content">
        <div id="canvas" ref={ref => (this.mount = ref)} />
        {/* <div className="label" >PROJECTS</div> */}

        <container className={  this.state.zoomedin ? 'projectappear': 'hidden_right'}>
          <Projectlist name={project_list[this.state.currproj]}></Projectlist>
          <button onClick={() => this.transition(String(project_list[this.state.currproj]))}  id="tomlarch">Learn More</button>
          {/* Have the buttons go here so that I can make descriptions dissapear when they are clicked */}
          <button id="cycle" onClick={this.cycle}> Next</button>

        </container> 
        
        <button className={  this.state.zoomedin || this.state.zoomedin_about || this.state.zoomedin_random ? 'return_appear': 'return_hidden'}  id="return" onClick={this.return}  >return</button>



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
  TWEEN.update();

  position(time);
  //controls.update();
  composer.render();
  frameId = requestAnimationFrame(animate)
}

function position(time){
  raycaster.setFromCamera( mouse, camera );
  var important = [scene.children[1],scene.children[2],scene.children[3]]

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



function loadSVG( file , svglocation) {
  var loader = new SVGLoader();

  loader.load( file, function ( data ) {
      var paths = data.paths;
      var group = new THREE.Group();
      group.scale.multiplyScalar( 0.007);
      group.position.x = svglocation.x;
      group.position.z = svglocation.z;

      group.position.y = svglocation.y;
      group.scale.y *= 1;
      group.rotation.y = 3.2;
      group.rotation.z= 3.15;



      for ( var i = 0; i < paths.length; i ++ ) {

          var path = paths[ i ];
          
          var fillColor = path.userData.style.fill;
          if ( guiData.drawFillShapes && fillColor !== undefined && fillColor !== 'none' ) {

              var material = new THREE.MeshBasicMaterial( {
                  color: new THREE.Color().setStyle( fillColor ),
                  opacity: path.userData.style.fillOpacity,
                  transparent: path.userData.style.fillOpacity < 1,
                  side: THREE.DoubleSide,
                  depthWrite: false,
                  wireframe: guiData.fillShapesWireframe
              } );

              var shapes = path.toShapes( true );

              for ( var j = 0; j < shapes.length; j ++ ) {

                  var shape = shapes[ j ];

                  var geometry = new THREE.ShapeBufferGeometry( shape );
                  var mesh = new THREE.Mesh( geometry, material );

                  group.add( mesh );

              }

          }

          var strokeColor = path.userData.style.stroke;

          if ( guiData.drawStrokes && strokeColor !== undefined && strokeColor !== 'none' ) {

              var material = new THREE.MeshBasicMaterial( {
                  color: new THREE.Color().setStyle( strokeColor ),
                  opacity: path.userData.style.strokeOpacity,
                  transparent: path.userData.style.strokeOpacity < 1,
                  side: THREE.DoubleSide,
                  depthWrite: false,
                  wireframe: guiData.strokesWireframe
              } );

              for ( var j = 0, jl = path.subPaths.length; j < jl; j ++ ) {

                  var subPath = path.subPaths[ j ];

                  var geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

                  if ( geometry ) {

                      var mesh = new THREE.Mesh( geometry, material );

                      group.add( mesh );

                  }

              }

          }

      }
      scene.add( group );

} );
}
export default Home;
