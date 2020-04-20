import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/datasci.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
import { SVGLoader } from '../svg/SVGLoader.js';
import { GUI } from '../gui/dat.gui.module.js';
import { OBJLoader } from '../obj/OBJLoader.js';

//import SVG
function importAll(r) {
    let objfiles = {};
    r.keys().map((item, index) => { objfiles[item.replace('./', '')] = r(item); });
    return objfiles;
  }
  
const objfiles = importAll(require.context('../svg', false, /\.(obj)$/));
const OrbitControls = require('three-orbitcontrols');


var camera, scene, renderer,controls;
var frameId;
var torus;
var object;

//Movement 
var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;
var texture

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
      35,
      width / height,
      1,
      1000
    )
    camera.position.set( 0, 7, - 10 );

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


    //ADD torus 
    var geometry = new THREE.TorusGeometry( .4, .07, 16, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = 1.57;
    torus.position.set(0,-.1,0);
    scene.add( torus );
    
    window.addEventListener('resize', this.handleWindowResize);

    // ADD KEYBOARD CONTROLS
    window.addEventListener( 'keydown', this.onKeyDown, false );
    window.addEventListener( 'keyup', this.onKeyUp, false );
    
    var loader = new OBJLoader();

    loader.load( objfiles['tree.obj'], function(model) {
        model.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material.color = 0x000000;
            }
        });
        model.position.set(0, 0, 0);
        model.scale.set(10.01, 10.01, 10.01);

        scene.add(model);
        start();

    });
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
            <p>Welcome to our datascience exhibition ! Try going to the blue chance questionmark</p>
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
    
     camera.lookAt(torus.position);


  
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


  torus.position.z += - velocity.z * delta 
  torus.position.x -= - velocity.x * delta 

  // Prompt 
  prompt();
  // Scene update

  controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function prompt() {
  if (torus.position.z <= -3 && torus.position.z >=-4.5  && torus.position.x <= -4 && torus.position.x >= -4.5){
      flag = 1;

  }
  else{
      flag = 0;
  }
}





export default Mlarch;
