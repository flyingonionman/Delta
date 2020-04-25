import React from 'react';
import '../css/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as THREE from "three";
const OrbitControls = require('three-orbitcontrols');

//Globals
var camera, scene, renderer,controls,frameId;
var cube;
class Home extends React.Component {
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
    scene.fog = new THREE.Fog( 0x152238 , 4, 15 );

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
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    window.addEventListener('resize', this.handleWindowResize);

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
      </div>    
       
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
  cube.rotation.x += .01
  cube.rotation.y += .01

  controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

export default Home;
