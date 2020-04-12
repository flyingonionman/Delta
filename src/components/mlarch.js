import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '../App.scss';

import * as THREE from "three";


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
    //ADD CUBE
    var geometry = new THREE.BoxGeometry(2, 1, 2)
    var material = new THREE.MeshBasicMaterial({ color: '#FFFFFF'     })

    this.cube = new THREE.Mesh(geometry, material)
    this.cube.position.x -= 2.5
    this.scene.add(this.cube)
    this.start()
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
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.animate)
    }
    renderScene = () => {
      this.renderer.render(this.scene, this.camera)
    }
  
 
  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.cube.scale.x = width

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

          <div id="info-body">
          <h1>AI-progettazione</h1>

            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          
          <button type="button">To gallery</button>

          </div>

      </div>    
 
    );
  }
}

export default Mlarch;
