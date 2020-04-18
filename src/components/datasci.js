import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
const OrbitControls = require('three-orbitcontrols');

var camera, scene, renderer,controls;
var frameId;
var cube;

//Movement 
var moveForward = false;
var moveBackward = false;


var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

class Mlarch extends React.Component {
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
    scene.background = new THREE.Color( 0x949292  );

    // Ground

    var plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 40, 40 ),
      new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
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
    camera.position.z = 12

    // Lights
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
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

    //ADD CUBE 
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
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
            case 87:
                moveForward = true;
                break;
            case 83: // s
                moveBackward = true;
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

    </div>    
 
    );
  }
}

function start () {
  if (!frameId) {
    frameId = requestAnimationFrame(animate)
  }
}

function renderScene () {
  renderer.render(scene, camera)
}

function animate () {

  // Movement control
  var time = performance.now();
  var delta = ( time - prevTime ) / 1000;
  velocity.z -= velocity.z * 10.0 * delta;
  direction.z = Number( moveForward ) - Number( moveBackward );
  
  if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
  prevTime = time;

  cube.position.z -= - velocity.z * delta 

  // Scene update
  controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}


export default Mlarch;
