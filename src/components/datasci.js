import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/datasci.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
import { SVGLoader } from '../svg/SVGLoader.js';
import { OrbitControls } from '../module/OrbitControls';

import TWEEN from '@tweenjs/tween.js';

//import SVG
function importAll(r) {
    let svgfiles = {};
    r.keys().map((item, index) => { svgfiles[item.replace('./', '')] = r(item); });
    return svgfiles;
  }
  
const svgfiles = importAll(require.context('../svg', false, /\.(svg)$/));

//import font
function importfont(r) {
  let listfonts = {};
  r.keys().map((item, index) => { listfonts[item.replace('./', '')] = r(item); });
  return listfonts;
}

const listfonts = importfont(require.context('../font', false, /\.(json)$/));


//globals
var camera, scene, renderer,controls;
var frameId;
var torus;
var tween;
var trailgeometry;
var trailmaterial;
var trail

var finished = false;
//Movement 
var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;


var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

//bloomrelated
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

var bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

//Text related
var params = {
  text : "three.js",
  height : 1,
  size : 1,
  hover : 0,
  curveSegments : 4,
  bevelThickness : 1,
  bevelSize : 1.5,
  bevelEnabled : true,
  font : undefined,
  fontName : "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight : "bold"

};

var words = ["New York","Louisiana", "Arkansas", "Michigan"]
var group, textMesh1, textGeo, materials;

//Prelim data for
var guiData = {
    currentURL: 'src/svg/Seminopoly.svg',
    drawFillShapes: true,
    drawStrokes: true,
    fillShapesWireframe: false,
    strokesWireframe: false
};

//hive 
var hive = {
    intro:{
      slot3:{occupied:false}
    },
    c1:{
      r1:{occupied:false},
      r2:{occupied:false},
      r3:{occupied:false}
    }
    ,
    c2:{
      r1:{occupied:false},
      r2:{occupied:false},
      r3:{occupied:false},
      r4:{occupied:false}
    }
}
var flag = 0;
var gui;
class Datasci extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
        descriptor : 0,
        pog :"poggers"
      };
    
  }
  componentDidMount(){
    this.init();
    this.loop();
    start();
  }

  loop = () =>{
        this.setState({
            descriptor : flag,
            pog : "kappa pride"
        });
      setTimeout(this.loop, 500);
  }

  init = () =>{
    var width = window.innerWidth
    var height = window.innerHeight
    //ADD SCENE

    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0xf5f5f5  );

    // Ground

    var plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 200,200 ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0xFFFFFF } )
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    scene.add( plane );

    plane.receiveShadow = true;

    //ADD CAMERA

    camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      1000
    )
    camera.position.set( 0, 15, 0 );
    camera.lookAt(0,0,0);

    // Lights

    scene.add( new THREE.HemisphereLight( 0x000000, 0x111122 ) );
    this.addShadowedLight( 1, 1, 1, 0x000000,5 );
    this.addShadowedLight( 0.5, 1, - 1, 0xbbaaff, .51 );

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

    //Add Text
    /* loadFont(); */

    group = new THREE.Group();
    group.position.y = 1;
    group.position.z = 1;
    group.position.x = 1;

    scene.add( group );
        
    //Load SVG
    loadSVG();

    //Add Trail
    trailgeometry = new THREE.SphereGeometry( .2, 32, 32 );
    trailmaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    trail  = new THREE.Mesh( trailgeometry, trailmaterial );
    


    //ADD torus 
    var geometry = new THREE.TorusGeometry( 1, .07, 16, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = 1.57;
    torus.position.set(17.5,-.1,17.5);
    scene.add( torus );
    

    window.addEventListener('resize', this.handleWindowResize);

    // ADD KEYBOARD CONTROLS
    window.addEventListener( 'keydown', this.onKeyDown, false );
    window.addEventListener( 'keyup', this.onKeyUp, false );
    
      
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

    onKeyDown = (e) => {
        
        switch (e.keyCode) {
            case 87: // w 
                moveForward = true;
                break;
            case 83: // s
                moveBackward = true;
                break;
            case 65: // a
                moveLeft = true;
                break;
            case 68: // d
                moveRight = true;
                break;
        }
    };
  
    onKeyUp = (e) => {
        switch (e.keyCode) {
            case 87:
                moveForward = false;
                break;
            case 83: // s
                moveBackward = false;
                break;
            case 65: // a
                moveLeft = false;
                break;
            case 68: // d
                moveRight = false;
                break;
        }
    };
      
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('input', this.resize);

  }

  render() {
  return (

    <div className="datasci" >    
        <div id="c" ref={ref => (this.mount = ref)} />
     
       <div className="information">
    
            <Describe name={this.state.descriptor} ></Describe>

        </div> 

       <Hive></Hive>
    </div>    
 
    );
  }
}

//GLOBAL FUNCITONS 
//
//

function start () {
  if (!frameId) {
    frameId = requestAnimationFrame(animate)
  }
}

function renderScene () {
  if (!finished){
    camera.position.set( torus.position.x, 20, torus.position.z );
    camera.lookAt(torus.position.x,0,torus.position.z);
  }
  else{
    camera.position.set( 0, 70, 0 );

  }
  renderer.render(scene, camera)
}

function animate () {

  // Movement control
  var time = performance.now();
  var delta = ( time - prevTime ) / 1000;

  velocity.z -= velocity.z * 10.0 * delta;
  velocity.x -= velocity.x * 10.0 * delta;

  direction.z = Number( moveForward ) - Number( moveBackward );
  direction.x = Number( moveRight ) - Number( moveLeft );

  if ( moveForward || moveBackward ) {
      velocity.z -= direction.z * 100.0 * delta;
      prompt();

  }
  if ( moveRight || moveLeft ) {
      velocity.x -= direction.x * 100.0 * delta;
      prompt();

  }

  prevTime = time;
  //puttrail();

  torus.position.z -= - velocity.z * delta 
  torus.position.x += - velocity.x * delta 
  //console.log(torus.position)
  // Prompt 
  prompt();
  // Scene update
  
  controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function prompt() {

  if (torus.position.z <= 21 && torus.position.z >=18  && torus.position.x <= 23 && torus.position.x >=  20.5 ){
    flag = 'move here';

  }
 
  else{
      var person = scene.getObjectByName('blackindividual')
        if(person){
        scene.remove( person );
      }
      flag = 0;
  }
}

function loadSVG( ) {
    var loader = new SVGLoader();

    loader.load( svgfiles['board.svg'], function ( data ) {
        var paths = data.paths;
        var group = new THREE.Group();
        group.scale.multiplyScalar( 0.01 );
        group.position.x = -11;
        group.position.z = -6.5;

        group.position.y = -.35;
        group.scale.y *= 1;
        group.rotation.x = 1.57;

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

function Hive(props){
  return(
    <div >
      <p className={ hive.intro.slot3.occupied ? 'intro1': 'hidden'} id="intro1">Surprise</p>
    </div>
  );
}
function Describe(props){
      switch(props.name) {
         case 3:
          return <p>1500 image data set of two benches randomly (and individually) rotating and shearing to create a confusing multi-perspectival images where the objects can no longer understood in reference to the ground plane.    </p>;
  
           break;
         case 2:
          return <p>Latent space walk in which a progressive gan is learning and becoming confused by the multi-perspectival bench images where the benches twist, grow, split, and meld like amoebas in a petri dish.</p>;
  
           break;
         case 1:
          return <p>Black individuals are discrimnated by certain charges and pay more bail on average </p>;
    
             break;  
          case 'move here':
          return <p>This box will contain whichever information that is helpful to you to progess further</p>;
  
              break;  
         default:
           return <p>kek 
           </p>;
       }
  }
  
function puttrail(){
  trail  = new THREE.Mesh( trailgeometry, trailmaterial );
  trail.name = "trail"
  trail.position.z = torus.position.z
  trail.position.x = torus.position.x
  trail.position.y = -.3
  
  scene.add( trail );  
  
}

function deletetrail(){
  scene.traverse(function(child) {
        if (child.name === "trail") {
          if (child.length> 0){

          scene.remove(child)
          }
        }
      
  })
  
}
export default Datasci;
