import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/datasci.scss';
import {
  Link
} from "react-router-dom";

import * as THREE from "three";
import { SVGLoader } from '../svg/SVGLoader.js';
import { OrbitControls } from '../module/OrbitControls';

import TWEEN from '@tweenjs/tween.js';
import {hive} from "./hivegeo";

//import SVG
function importAll(r) {
    let svgfiles = {};
    r.keys().map((item, index) => { svgfiles[item.replace('./', '')] = r(item); });
    return svgfiles;
  }
  
const svgfiles = importAll(require.context('../svg', false, /\.(svg)$/));

//import font
function importfont(r) {
  let listfonts = {};
  r.keys().map((item, index) => { listfonts[item.replace('./', '')] = r(item); });
  return listfonts;
}

const listfonts = importfont(require.context('../font', false, /\.(json)$/));


//globals
var camera, scene, renderer,controls;
var frameId;
var torus;
var tween;
var trailgeometry;
var trailmaterial;
var trail;
var zoomedout= false;

var finished = false,finishedanim =false;
//Movement 
var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

//User data
var resultset = [ ];


//bloomrelated
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

var bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

//Text related
var params = {
  text : "three.js",
  height : 1,
  size : 1,
  hover : 0,
  curveSegments : 4,
  bevelThickness : 1,
  bevelSize : 1.5,
  bevelEnabled : true,
  font : undefined,
  fontName : "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight : "bold"

};

var words = ["New York","Louisiana", "Arkansas", "Michigan"]
var group, textMesh1, textGeo, materials;

//Prelim data for
var guiData = {
    currentURL: 'src/svg/Seminopoly.svg',
    drawFillShapes: true,
    drawStrokes: true,
    fillShapesWireframe: false,
    strokesWireframe: false
};

//hive 


var flag = 0;
var gui;
class Datasci extends React.Component {
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
      new THREE.PlaneBufferGeometry( 300,150 ),
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
    camera.lookAt(0,0,0);

    // Lights

    scene.add( new THREE.HemisphereLight( 0x000000, 0x111122 ) );
    this.addShadowedLight( 1, 1, 1, 0x000000,5 );
    this.addShadowedLight( 0.5, 1, - 1, 0xbbaaff, .51 );

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

    //Add Text
    /* loadFont(); */

    group = new THREE.Group();
    group.position.y = 1;
    group.position.z = 1;
    group.position.x = 1;

    scene.add( group );
        
    //Load SVG
    
    var boardlocation ={
      x:-11,
      y:-.35,
      z:-6.5
    }
    var example1location ={
      x:31.4,
      y:-.35,
      z:-16.5
    }
    var example2location ={
      x:31.4,
      y:-.35,
      z:30.5
    }

    var board =svgfiles['board.svg']
    var example1 =svgfiles['example1.svg']
    var example2 =svgfiles['example2.svg']


    loadSVG(board,boardlocation);

    loadSVG(example1,example1location);
    loadSVG(example2,example2location);


    //Add Trail
    trailgeometry = new THREE.SphereGeometry( .2, 32, 32 );
    trailmaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    trail  = new THREE.Mesh( trailgeometry, trailmaterial );
    


    //ADD torus 
    var geometry = new THREE.TorusGeometry( 1, .07, 16, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = 1.57;
    torus.position.set(17.5,-.1,17.5);
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
        <ul>
          <li><a>MINYOUNG NA // minyoungwork1997@gmail.com //</a><a href="https://www.minyoungna.com">Return Home</a></li>
        </ul>
      <div id="c" ref={ref => (this.mount = ref)} />
     
      <div className="information">
        <Describe name={this.state.descriptor} ></Describe>
      </div> 

        <div id="AR" className= { flag == 'finished' ? 'appear' : 'hiddenright'}>black male avg bail bond: 24971.05 (41 individuals)</div>
        <div id="NY" className= { flag == 'finished' ? 'appear' : 'hiddenright'}>black male avg bail bond: 85799.36 (617 individuals)</div>
        <div id="LA" className= { flag == 'finished' ? 'appear' : 'hiddenright'}>black male avg bail bond: 5130.88 (2274 individuals)</div>

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
  if (!finished){
    camera.position.set( torus.position.x, 20, torus.position.z );
    camera.lookAt(torus.position.x,0,torus.position.z);
  }
  else{
    camera.position.set( 55, 80,20 );
    camera.lookAt(55,0,20);

  }


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

  }
  if ( moveRight || moveLeft ) {
      velocity.x -= direction.x * 100.0 * delta;

  }

  prevTime = time;
  //puttrail();

  torus.position.z -= - velocity.z * delta 
  torus.position.x += - velocity.x * delta 
  //console.log(torus.position)
  // Prompt 
  prompt();



  // Scene update
  //console.log(scene.children)
  //controls.update();
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function prompt() {

  if (torus.position.z <= 21 && torus.position.z >=18  && torus.position.x <= 23 && torus.position.x >=  20.5 ){
    flag = 'move here';

  }
  
  else if (torus.position.z <= 18 && torus.position.z >=16  && torus.position.x <= 27.5 && torus.position.x >=  25 ){
    flag = 'surprise'
    
    var blurb =svgfiles['intro_1.svg']
    if ( !hive.intro.slot3.occupied ){ loadSVG(blurb ,hive.intro.slot3.location);}
    hive.intro.slot3.occupied = true

  }

  else if (torus.position.z <= 20.5 && torus.position.z >=18.5  && torus.position.x <= 32.5 && torus.position.x >=  30 ){
    flag = 'purpose'
    
    var blurb =svgfiles['intro_2.svg']
    
    if ( !hive.intro.slot4.occupied ) {loadSVG(blurb ,hive.intro.slot4.location);}
    hive.intro.slot4.occupied = true

  }

  else if (torus.position.z <= 18 && torus.position.z >=16   && torus.position.x <= 37 && torus.position.x >=  34.5 ){
    flag = 'us'
    
    var ny =svgfiles['state_NY.svg']
    var la =svgfiles['state_LA.svg']
    var ar =svgfiles['state_AR.svg']
    var mi =svgfiles['state_MI.svg']

    if ( !hive.c1.r2.occupied) {
      loadSVG(ny ,hive.c1.r1.location);
      loadSVG(la ,hive.c1.r3.location);
      loadSVG(ar ,hive.c2.r2.location);
      loadSVG(mi ,hive.c2.r3.location);
    }

    hive.c1.r2.occupied= true

  }

  else if (torus.position.z <= 12.5 && torus.position.z >=10.5   && torus.position.x <= 37 && torus.position.x >=  34.5 ){
    flag = 'ny'
    if ( !hive.c1.r1.occupied) {  
      loadSVG(svgfiles['state_NY_fill.svg'], hive.c1.r1.location )
      loadSVG(svgfiles['BJS_code.svg'], hive.c2.r1.location )
      resultset.push("NewYork")

    }
    hive.c1.r1.occupied= true
  }

  else if (torus.position.z <= 23.5 && torus.position.z >=21   && torus.position.x <= 37 && torus.position.x >=  34.5 ){
    flag = 'la'
    if ( !hive.c1.r3.occupied) { 
      loadSVG(svgfiles['state_LA_fill.svg'], hive.c1.r3.location )
      loadSVG(svgfiles['BJS_code.svg'], hive.c2.r1.location )
    }
    hive.c1.r3.occupied= true
  }

  else if (torus.position.z <= 15.5 && torus.position.z >=13   && torus.position.x <= 42 && torus.position.x >=  39.5 ){
    flag = 'ar'
    if ( !hive.c2.r2.occupied) {  
      loadSVG(svgfiles['state_AR_fill.svg'], hive.c2.r2.location )
      loadSVG(svgfiles['BJS_code.svg'], hive.c2.r1.location )
    }
    hive.c2.r2.occupied= true
  }

  else if (torus.position.z <= 20.5 && torus.position.z >=18.5   && torus.position.x <= 42 && torus.position.x >=  39.5  ){
    flag = 'mi'
    if ( !hive.c2.r3.occupied) {  
      loadSVG(svgfiles['state_MI_fill.svg'], hive.c2.r3.location )
    
    }
    hive.c2.r3.occupied= true

  }
  
  else if (torus.position.z <= 10 && torus.position.z >= 7.5   && torus.position.x <= 42 && torus.position.x >=  39.5  ){
    flag = 'BJScode'
    if ( !hive.c2.r1.occupied) { 
       loadSVG(svgfiles['BJS_code_fill.svg'], hive.c2.r1.location )
       loadSVG(svgfiles['BJS_cat.svg'], hive.c3.r2.location )

    }
    hive.c2.r1.occupied= true

  }

  else if (torus.position.z <= 13.2 && torus.position.z >= 10.5   && torus.position.x <= 46 && torus.position.x >=  43.5  ){
    flag = 'crimecat'
    if ( !hive.c3.r2.occupied) { 
       loadSVG(svgfiles['BJS_cat_fill.svg'], hive.c3.r2.location )
       loadSVG(svgfiles['crime_drug.svg'], hive.c3.r1.location )
       loadSVG(svgfiles['crime_violent.svg'], hive.c4.r2.location )
       loadSVG(svgfiles['crime_property.svg'], hive.c3.r3.location )
       loadSVG(svgfiles['crime_other.svg'], hive.c4.r3.location )

    }
    hive.c3.r2.occupied= true

  }

  else if (torus.position.z <= 7.5 && torus.position.z >= 5   && torus.position.x <= 46 && torus.position.x >=  43.5  ){
    flag = 'drugs'
    if ( !hive.c3.r1.occupied) { 
       loadSVG(svgfiles['crime_drug_fill.svg'], hive.c3.r1.location )
       resultset.push('drugs')

    }
    hive.c3.r1.occupied= true
  }

  else if (torus.position.z <= 10 && torus.position.z >= 7.8   && torus.position.x >= 48.3 && torus.position.x <=  50.5  ){
    flag = 'violent'
    if ( !hive.c4.r2.occupied) { 
       loadSVG(svgfiles['crime_violent_fill.svg'], hive.c4.r2.location )
       loadSVG(svgfiles['race_white.svg'], hive.c5.r2.location )
       loadSVG(svgfiles['race_black.svg'], hive.c5.r3.location )

       resultset.push('violent')

    }
    hive.c4.r2.occupied= true
  }

  else if (torus.position.z <= 12.5 && torus.position.z >= 10   && torus.position.x >= 53 && torus.position.x <=  55.5  ){
    if ( !hive.c5.r2.occupied) { 
      loadSVG(svgfiles['race_black_fill.svg'], hive.c5.r3.location )
      loadSVG(svgfiles['gender_male.svg'], hive.c6.r2.location )
      loadSVG(svgfiles['gender_female.svg'], hive.c5.r4.location )

      resultset.push('black')

    }
    hive.c5.r2.occupied= true
  }

  else if (torus.position.z <= 15 && torus.position.z >= 13   && torus.position.x >= 57.5 && torus.position.x <=  60  ){
    flag = 'finished'

    if ( !hive.c6.r2.occupied) { 
      loadSVG(svgfiles['gender_male_fill.svg'], hive.c6.r2.location )
      finished = true;

    }
    hive.c6.r2.occupied= true
  }

  else{
      flag = 0;
  }
}

function loadSVG( file , svglocation) {
    var loader = new SVGLoader();

    loader.load( file, function ( data ) {
        var paths = data.paths;
        var group = new THREE.Group();
        group.scale.multiplyScalar( 0.01 );
        group.position.x = svglocation.x;
        group.position.z = svglocation.z;

        group.position.y = svglocation.y;
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
        case 'move here':
          return <p>This box will contain whichever information that is helpful to you to progess further. Move on to the next Hex</p>;
              break;  
         case 'purpose':
          return <p>The point of this project is to illustrate the discrepancies in the bond amount and represent with paths.
            Move to the United states hex
          </p>;
  
         case 'surprise':
          return <p>The content of the Hexes appear as you go, and it leaves a trail behind. Continue moving</p>;
  

         case 'ny':
          return <p>New York happens to be the only state will dollar bail. </p>;
    
         case 'la':
          return <p>States have varying degree of information  </p>;
    
          ;  
         case 'ar':
          return <p>States have varying degree of information  </p>;
    
         case 'mi':
          return <p>States have varying degree of information  </p>;
        case 'us':
          return <p>Choose a state to begin your entry ( only NYC works now)  </p>;
        case 'BJScode':
          return <p>we used BJS ( Bureau of Justice Statistics ) codes to create this ontology. Each of the states have
             their own labeling of the same crimes, and they can be grouped into one BJS offense category.
             This gives a national view of how a crime is represented in each of the states.   </p>;
        case 'crimecat':
          return <p>Choose a category of crime ( go to violent crime for now) </p>;
        case 'drugs':
          return <p>Drug related crimes average about 83204 in NY{resultset}</p>
        case 'violent':
          return <p>Violent crimes average about 84819 per NY</p>
        case 'finished':
          return <p>{resultset}: is the path you have taken... <br></br>
          There was no gender/race data for Michigan so we could not make a point of comparison with the state.
          We hope that this visual ontology can represent not only an accurate bail bond amount for 
          a specific node, but also the diversity of the paths one can take. 
          
          </p>

         default:
           return <p>
           </p>;
       }
  }
  


export default Datasci;
