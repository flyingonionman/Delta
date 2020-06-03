import React from 'react';
import '../css/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
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
var project_list =["mlarch","datasci","unionjrnl","babymon","dropblocks"]
var about_list = ["about_me","about_school"]
var random_list= [ "soundcloud", "graphicdesign"]
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
      zoomedin_random:zoomcontrol,
      currabout:0,
      currproj: 0,
      currrandom:0
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

    this.setState({ zoomedin: false , zoomedin_about:false, zoomedin_random:false });
    gzoom = false;
  }

  onclick = (event) =>{
    event.preventDefault();
    var important = [scene.children[1],scene.children[2],scene.children[3]]
    var intersects = raycaster.intersectObjects(  important );
  
    if ( intersects.length > 0 ) {
      var id = intersects[0].object.name
      console.log(id)
      switch (id){
        case "projects" :{
        gzoom = true;
        this.setState({ zoomedin: true });
        tween = new TWEEN.Tween(camera.position)
        .to({ x: -12.5 ,y:-3 , z:12}, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start(); 
  
        tween = new TWEEN.Tween(camera.rotation)
        .to({ x:.8,y:-1,z:.7}, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start(); 
       
  
        
        break;
        }
        case "about" :{
          gzoom = true;
          this.setState({ zoomedin_about: true });
          tween = new TWEEN.Tween(camera.position)
          .to({ x: -2 ,y:-3 , z:8.5}, 1500) 
          .easing(TWEEN.Easing.Quadratic.Out)
          .start(); 
          
          tween = new TWEEN.Tween(camera.rotation)
          .to({ y:1 }, 1500) 
          .easing(TWEEN.Easing.Quadratic.Out)
          .start(); 
         
    
        
          break;

          }
          case "random" :{
            gzoom = true;
            this.setState({ zoomedin_random: true });
            tween = new TWEEN.Tween(camera.position)
            .to({ x: 2.5 ,y:-3 , z:9.5}, 1500) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .start(); 
            
            tween = new TWEEN.Tween(camera.rotation)
            .to({ y:-1 }, 1500) 
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

    camera.position.z = 37
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
    /* controls = new OrbitControls(camera,renderer.domElement );
    controls.update(); */

    //ADD CUBE 
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
    var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );

    var material = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );
    var material2 = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );
    var material3 = new THREE.MeshPhongMaterial( {color: 0x192841, shininess:1} );

    cube[1] = new THREE.Mesh( geometry, material );
    cube[1].material.emissive.setHSL( .1, .8, .2);

    cube[2] = new THREE.Mesh( geometry2, material2 );
    cube[2].material.emissive.setHSL( .4, .8, .1);
    
    cube[3] = new THREE.Mesh( geometry2, material3 );
    cube[3].material.emissive.setHSL( .6, .8, .1);

    cube[1].position.y = 4;
    cube[2].position.x = -10;    cube[2].position.y = -3;
    cube[3].position.x = 10;    cube[3].position.y = -3;


    cube[1].name = "projects";
    cube[2].name = "about";
    cube[3].name = "random";


    scene.add(cube[1]);

    scene.add(cube[2]);

    scene.add(cube[3]);

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
    var banner_about  ={      x:-17,      y:1,      z:.2    }
    var banner_random  ={      x:5,      y:1,      z:.2    }

    var project =svgfiles['main_projects.svg']
    loadSVG(project,banner_project);

    var about =svgfiles['main_about.svg']
    loadSVG(about,banner_about);   
    
    var random =svgfiles['main_random.svg']
    loadSVG(random,banner_random);   
  }

  cycle = () =>{
    selector = 1;
    if (this.state.zoomedin) {
      selector = 1;
      if( this.state.currproj < 4){       this.setState({currproj: this.state.currproj+1})    }
      else{  this.setState({currproj: 0})  }
    } 

    if (this.state.zoomedin_about) {
      selector = 2;

      if( this.state.currabout < 1){       this.setState({currabout: this.state.currabout+1})    }
      else{  this.setState({currabout: 0})  }
    } 

    if (this.state.zoomedin_random) {
      selector = 3;
      if( this.state.currrandom < 1){       this.setState({currrandom: this.state.currrandom+1})    }
      else{  this.setState({currrandom: 0})  }
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
    console.log(pageurl)

    zoomcontrol = true;
    this.setState({ zoomedin: false , zoomedin_about:false,zoomedin_random:false });
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
    if (pageurl == "unionjrnl") {     setTimeout(function(){   window.location.href = "http://unionjournal.space/";  }, 3000);  }
    if (pageurl == "babymon") {       setTimeout(function(){   window.location.href = "https://www.youtube.com/watch?v=ycRHIYA70sg";  }, 3000);  }
    if (pageurl == "mlarch") {     setTimeout(function(){   window.location.href = "https://www.minyoungna.com/mlarch";  }, 3000);  }
    if (pageurl == "datasci") {      setTimeout(function(){   window.location.href = "https://www.minyoungna.com/datasci";  }, 3000);  }
    if (pageurl == "dropblocks") {   setTimeout(function(){   window.location.href = "https://github.com/ArianaFreitag/cgml-midterm";  }, 3000);  }
    if (pageurl == "soundcloud") {   setTimeout(function(){   window.location.href = "https://soundcloud.com/fantalone";  }, 3000);  }

  }
  
  render() {
  return (

    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a href="#contact">//A MINYOUNG NA WORKS//</a></li>
      </ul>

      </div>
      <div className="content">
        <div id="canvas" ref={ref => (this.mount = ref)} />
        {/* <div className="label" >PROJECTS</div> */}

        <container className={  this.state.zoomedin ? 'projectappear': 'hidden_right'}>
          <Projectlist name={project_list[this.state.currproj]}></Projectlist>
          <button onClick={() => this.transition(String(project_list[this.state.currproj]))}  id="tomlarch">To {String(project_list[this.state.currproj])}</button>
          <button id="cycle" onClick={this.cycle}> Next</button>
          {/* Have the buttons go here so that I can make descriptions dissapear when they are clicked */}

        </container> 

        <container className={  this.state.zoomedin_about ? 'aboutappear': 'hidden_left'}>
          <Aboutlist name={about_list[this.state.currabout]}></Aboutlist>
          <button id="cycle" onClick={this.cycle}> Next</button>

        </container> 

        <container className={  this.state.zoomedin_random ? 'projectappear': 'hidden_right'}>
          <Randomlist name={random_list[this.state.currrandom]}></Randomlist>
          <button onClick={() => this.transition(String(random_list[this.state.currrandom]))}  id="tomlarch">To {String(random_list[this.state.currrandom])}</button>
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
      </div>;
  case "unionjrnl":
    return <div>
      <h1>UNION web journal design </h1>
      <p>Helped artists
      </p>
      </div>;
  case "babymon":
    return <div>
      <h1>Baby monitoring device project</h1>
      <p>Done as a part of my senior engineering projects.
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

function Aboutlist(props) {
  switch ( props.name) { 
  case "about_me":
    return <div>
      <h1>Who am I?</h1>
      <p>
      I am Minyoung Na
      </p>
      </div>;
  case "about_school":
    return <div>
      <h1>Curriculum</h1>
      <p>Creating simple but effective visualization for the purpose of helping the bail project.
      </p>
      </div>;

  default:
    return 0
  }
}

function Randomlist(props) {
  switch ( props.name) { 
  case "soundcloud":
    return <div>
      <h1>Music</h1>
      <p> I make tunes on FL studio when I have time. If you don't expect anything it might sound bearable.

      </p>
      </div>;
  case "graphicdesign":
    return <div>
      <h1>Graphic design</h1>
      <p>Some design stuff I learned to do as an engineer
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
