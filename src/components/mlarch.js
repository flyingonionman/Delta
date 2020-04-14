import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  Link
} from "react-router-dom";
import { STLLoader } from '../stl/STLLoader.js';
import STLViewer from 'stl-viewer'

import * as THREE from "three";
const OrbitControls = require('three-orbitcontrols')

function importAll(r) {
  let stlfiles = {};
  r.keys().map((item, index) => { stlfiles[item.replace('./', '')] = r(item); });
  console.log(stlfiles["Bench.stl"])
  return stlfiles;
}

const stlfiles = importAll(require.context('../stl', false, /\.(stl)$/));

var camera, scene, renderer,controls;
var bench;
var frameId;

class Mlarch extends React.Component {
  componentDidMount(){
    this.init();
  }

  init = () =>{
    var loader = new STLLoader()
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

    //ADD BENCH 
    //LOAD as ASCII
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0x111111, shininess: 300 } );

    loader.load( stlfiles['Bench.stl'], function ( geometry ) {
      geometry.applyMatrix( new THREE.Matrix4().makeTranslation(20, 32, -20) );

      bench = new THREE.Mesh( geometry, material );
      bench.scale.set( 0.05,  0.05, 0.05 );
      bench.rotation.x = 45;
      
      bench.position.x = -8 ;
      bench.position.y = .8 ;
      bench.position.z = 0 ;

      bench.castShadow = true;
      bench.receiveShadow = true;
      scene.add( bench );
      console.log( bench)
      
      start();
    } );  


    //ADD SLIDER
    var slider = document.getElementById("slider");
    slider.addEventListener("input", resize);
    
    var slider2 = document.getElementById("slider2");
    slider2.addEventListener("input", resizey);

    scene.add(this.cube);
    window.addEventListener('resize', this.handleWindowResize);

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

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(renderer.domElement)
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('input', this.resize);

  }

  

  
  render() {
  return (

    <div className="Mlarch_intro" >    
          <div id="c" ref={ref => (this.mount = ref)} />
          <input className="controller" type="range" min="0" max="10" step="0.1" id="slider" orient="vertical" />
          <input className="controller" type="range" min="0" max="10" step="0.1" id="slider2" orient="vertical" />

          <div id="info-body">
          <h1>AI-progettazione</h1>
          <h3>Move around ! </h3>

          <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          </p>  
          <button type="button"><Link  style={{ textDecoration: 'none' , color:'black'}} to="/mlarch_gallery">To gallery</Link></button>
          
            <div id="credits">
              <h3>Credits go to</h3>
              <h4>Students :</h4>
              <p>Ariana Freitag, EE'20 | Minyoung Na, BSE'20 | Jihoon Park, ARCH'21 | Willem Smith-Clark, ARCH'21</p>
              <h4>Advisors :</h4>
              <p>Sam Keene, Professor of Electrical Engineering | Ben Aranda, Assistant professor of Architecture  </p>

              <hr></hr>
              <h3><a href="https://www.instagram.com/machine_learning_architecture/">ML + ARCH @ Cooper Union</a></h3>
            </div>
          
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

  controls.update();
  bench.rotation.x += 0.01;
  //bench.rotation.z += 0.01;

  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function resize (e) {
  var target = (e.target) ? e.target : e.srcElement;
  bench.scale.x = target.value/100; 
  //bench.position.x = target.value/100 -8
}

function resizey (e) {
  var target = (e.target) ? e.target : e.srcElement;
  bench.scale.y = target.value/100;
  bench.position.y = target.value/100  
}

export default Mlarch;
