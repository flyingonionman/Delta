import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

import * as THREE from "three";


class Mlarch extends React.Component {
  componentDidMount() {
    console.log("loaded")
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    this.mount.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( 1, 1, 3 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.x -= 3;
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };
    animate();
  }

  render() {
  return (

    <div className="Mlarch_intro" >    
          <div ref={ref => (this.mount = ref)} />

          <div id="info-body">
          <h1>AI-progettazione</h1>

            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          </div>

     
      </div>    
 
    );
  }
}

export default Mlarch;
