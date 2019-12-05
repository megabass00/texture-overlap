// import * as THREE from './lib/three.module.js';
// const THREE = require('./lib/three.module.js')

const container = document.getElementById('container');
const uploadButton = document.getElementById('upload-button');
const mousePositionContainer = document.getElementById('mouse-position');

let mousePosition = { x: 0, y: 0 };


// Event Listeners //
container.addEventListener('mousemove', e => {
  if (!e) { e = window.event; } // ie6
  mousePosition.x = e.pageX - container.offsetLeft;
  mousePosition.y = e.pageY - container.offsetTop;
  mousePositionContainer.innerText = `
    Mouse Position:
    X: ${mousePosition.x}
    Y: ${mousePosition.y}
  `;
}, false);

uploadButton.onchange = event => {
  console.log('User selected image', event.target.files[0]);
  const reader = new FileReader();
  reader.onloadend = e => {
    document.getElementById('bg-image').src = reader.result;
  }
  reader.readAsDataURL(event.target.files[0]);
}



let camera;
let controls;
let renderer;
let scene;
let mesh;

scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x8FBCD4 );

createCamera();
createControls();
createLights();
createMeshes();
createRenderer();

renderer.setAnimationLoop(() => {
  // update();
  // render();
  renderer.render( scene, camera );
});


function createCamera() {
  camera = new THREE.PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    100, // far clipping plane
  );
  camera.position.set( 0, 0, 100 );
}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // sky color
    0x202020, // ground color
    5, // intensity
  );
  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );
  scene.add( ambientLight, mainLight );
}

function createMeshes() {
  // var geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
  var geometry = new THREE.PlaneGeometry( 20, 20 );
  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(new THREE.Vector3(10, 20, 0));
  // geometry.vertices.push(new THREE.Vector3(10, 60, 0));
  // geometry.vertices.push(new THREE.Vector3(50, 60, 0));
  // geometry.vertices.push(new THREE.Vector3(50, 20, 0));
  // geometry.vertices.push(new THREE.Vector3(10, 20, 0));

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load( 'textures/4.png' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.set( 0, 0 );
  texture.repeat.set( 1, 1 );
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;
  const material = new THREE.MeshStandardMaterial( {
    map: texture,
  } );

  mesh = new THREE.Mesh( geometry, material );
  const degrees = 45;
  mesh.rotation.y = (degrees / 180) * Math.PI;
  // mesh.rotation.set(new THREE.Vector3( 0, Math.PI / 4, 0));
  scene.add( mesh );
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
// function update() {
//   // Don't delete this function!
// }

// render, or 'draw a still image', of the scene
// function render() {
//   renderer.render( scene, camera );
// }
