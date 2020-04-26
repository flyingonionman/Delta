import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/datasci.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
import { SVGLoader } from '../svg/SVGLoader.js';
import { GUI } from '../gui/dat.gui.module.js';
import { OrbitControls } from '../module/OrbitControls';

//import SVG
function importAll(r) {
    let svgfiles = {};
    r.keys().map((item, index) => { svgfiles[item.replace('./', '')] = r(item); });
    return svgfiles;
  }
  
const svgfiles = importAll(require.context('../svg', false, /\.(svg)$/));

var camera, scene, renderer,controls;
var frameId;
var torus;

//Movement 
var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;


var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

//Prelim data for
var guiData = {
    currentURL: 'src/svg/Seminopoly.svg',
    drawFillShapes: true,
    drawStrokes: true,
    fillShapesWireframe: false,
    strokesWireframe: false
};

var flag = 0;
var gui;
class Mlarch extends React.Component {
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
      new THREE.PlaneBufferGeometry( 40, 40 ),
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

    // Lights
    scene.add( new THREE.HemisphereLight( 0x000000, 0x111122 ) );
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
    //controls = new OrbitControls(camera,renderer.domElement );
    //controls.update();

    //GUI

    //Load SVG
    loadSVG();

    


    //ADD torus 
    var geometry = new THREE.TorusGeometry( .4, .07, 16, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = 1.57;
    torus.position.set(-9,-.1,3);
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
        <div id="legend" >
          W A S D to move around
        </div>
        <div className="information">
    
            <Describe name={this.state.descriptor} ></Describe>

        </div>
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
    
  camera.lookAt(0,0,0);


  
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


  torus.position.z -= - velocity.z * delta 
  torus.position.x += - velocity.x * delta 

  console.log( torus.position)
  // Prompt 
  prompt();
  // Scene update
  
  //controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function prompt() {
  if (torus.position.z <= 4 && torus.position.z >=2  && torus.position.x <= -4.5 && torus.position.x >= -6.5 ){
      flag = 1;

      //Draw lines for directions
      var material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
      var points = [];
      points.push( new THREE.Vector3( -3, 1,-2 ) );
      points.push( new THREE.Vector3( -6, 1, -2) );

      var geometry = new THREE.BufferGeometry().setFromPoints( points );
      var line = new THREE.Line( geometry, material );
      line.name = "blackindividual"
      scene.add( line );

  }
  else{
      var person = scene.getObjectByName('blackindividual')
        if(person){
        scene.remove( person );
      }
      flag = 0;
  }
}

function createGUI() {

    if ( gui ) gui.destroy();

    gui = new GUI( { width: 350 } );

    gui.add( guiData, 'drawStrokes' ).name( 'W A S D to MOVE' ).onChange( update );

    gui.add( guiData, 'drawFillShapes' ).name( 'Go to the blue question mark' ).onChange( update );

    gui.add( guiData, 'strokesWireframe' ).name( 'Wireframe strokes' ).onChange( update );

    gui.add( guiData, 'fillShapesWireframe' ).name( 'Wireframe fill shapes' ).onChange( update );

    function update() {

        loadSVG(  );

    }

}

function loadSVG( ) {
    var loader = new SVGLoader();

    loader.load( svgfiles['board.svg'], function ( data ) {
        var paths = data.paths;
        var group = new THREE.Group();
        group.scale.multiplyScalar( 0.01 );
        group.position.x = -11;
        group.position.z = -5;

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
          case 4:
          return <p>Latent space walk through the progressive gan trained on randomly assembled timber members at some points finding regularity with straight member perpendicularly connected while other times melting into glitchy bird’s nests  </p>;
  
              break;  
         default:
           return <p>           Welcome to our datascience exhibition ! 
           </p>;
       }
  }
  
export default Mlarch;
