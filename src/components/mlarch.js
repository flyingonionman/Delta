import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import * as THREE from "three";
const OrbitControls = require('three-orbitcontrols')


class Mlarch extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount(){
    var width = window.innerWidth
    var height = window.innerHeight
    //ADD SCENE


    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 4
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
    this.scene.add(this.cube)
    this.start()

    window.addEventListener('resize', this.handleWindowResize);

  }

  movecam = () =>{


    
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
  }


  render() {
  return (

    <div className="Mlarch_intro" >    
          <div id="c" ref={ref => (this.mount = ref)} />
          <input type="range" min="0" max="10" value="0" step="0.1" id="slider" orient="vertical" />
          <div id="info-body">
          <h1>AI-progettazione</h1>
          <h3>Move around ! </h3>

            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          
          <button type="button"><Link  style={{ textDecoration: 'none' , color:'black'}} to="/mlarch_gallery">To gallery</Link></button>

          </div>

      </div>    
 
    );
  }
}

export default Mlarch;
