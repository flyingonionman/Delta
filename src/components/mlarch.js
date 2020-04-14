import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  Link
} from "react-router-dom";
import { STLLoader } from '../stl/STLLoader.js';

import * as THREE from "three";
const OrbitControls = require('three-orbitcontrols')


class Mlarch extends React.Component {
  componentDidMount(){
    var loader = new STLLoader()


    var width = window.innerWidth
    var height = window.innerHeight
    //ADD SCENE


    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0x72645b );
    this.scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

    // Ground

    var plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 40, 40 ),
      new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    this.scene.add( plane );

    plane.receiveShadow = true;

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      1,
      15
    )
    this.camera.position.z = 4
    this.cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );


    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    //ADD CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement );
    this.controls.update();

    //ADD CUBE
    var geometry = new THREE.BoxGeometry(2, 1, 2)
    var material = new THREE.MeshBasicMaterial({ color: '#FFFFFF'     })

    this.cube = new THREE.Mesh(geometry, material)

    this.cube.position.x -= 2.5

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
    this.scene.add(line);

    //ADD BENCH 
    //LOAD as ASCII

    loader.load( '../stl/Bench.stl', function ( geometry ) {
      var material = new THREE.MeshPhongMaterial( {
          ambient: 0xff5533, 
          color: 0xffffff, 
          specular: 0x111111,
          shininess: 200 } 
                                                  
      );
      var mesh = new THREE.Mesh( geometry, material );		
      mesh.scale.set( 200, 200.5, 200.5 );
	
      this.scene.add( mesh ); 
      
    } );

    //ADD SLIDER
    var slider = document.getElementById("slider");
    slider.addEventListener("input", this.resizeCube);
    
    this.scene.add(this.cube);

    this.start()

    window.addEventListener('resize', this.handleWindowResize);
  }

  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
  }
  
  stop = () => {
      cancelAnimationFrame(this.frameId)
  }
  
  
  animate = () => {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
    this.controls.update();

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }
  
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  
 
  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height)

  };

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('input', this.resizeCube);

  }

  resizeCube = (e) => {
    var target = (e.target) ? e.target : e.srcElement;
    this.cube.scale.x  = target.value;
  }

  render() {
  return (

    <div className="Mlarch_intro" >    
          <div id="c" ref={ref => (this.mount = ref)} />
          <input type="range" min="0" max="10" step="0.1" id="slider" orient="vertical" />
          <div id="info-body">
          <h1>AI-progettazione</h1>
          <h3>Move around ! </h3>

            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          
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

export default Mlarch;
