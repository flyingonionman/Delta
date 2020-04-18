import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/mlarch.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
import { SVGLoader } from '../svg/SVGLoader.js';
import { GUI } from '../gui/dat.gui.module.js';

const OrbitControls = require('three-orbitcontrols');

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
    currentURL: 'svg/seminopoly.svg',
    drawFillShapes: true,
    drawStrokes: true,
    fillShapesWireframe: false,
    strokesWireframe: false
};

var gui;
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
    camera.position.set( 0, 10, - 12 );

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

    //GUI
    createGUI();

    //Load SVG
    var url = '../svg/Seminopoly.svg'
    loadSVG(url);

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
    torus.position.set(0,-.45,0);
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

  if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
  if ( moveRight || moveLeft ) velocity.x -= direction.x * 100.0 * delta;

  prevTime = time;

  torus.position.z += - velocity.z * delta 
  torus.position.x -= - velocity.x * delta 

  // Scene update

  controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function createGUI() {

    if ( gui ) gui.destroy();

    gui = new GUI( { width: 350 } );

    gui.add( guiData, 'drawStrokes' ).name( 'Draw strokes' ).onChange( update );

    gui.add( guiData, 'drawFillShapes' ).name( 'Draw fill shapes' ).onChange( update );

    gui.add( guiData, 'strokesWireframe' ).name( 'Wireframe strokes' ).onChange( update );

    gui.add( guiData, 'fillShapesWireframe' ).name( 'Wireframe fill shapes' ).onChange( update );

    function update() {

        loadSVG( guiData.currentURL );

    }

}

function loadSVG( url ) {
    var loader = new SVGLoader();

    loader.load( url, function ( data ) {

        var paths = data.paths;
        console.log(url);
        var group = new THREE.Group();
        group.scale.multiplyScalar( 0.25 );
        group.position.x = 0;
        group.position.y = 0;
        group.scale.y *= - 1;

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

export default Mlarch;
