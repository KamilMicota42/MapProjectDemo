import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Vector2 } from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.outputEncoding = THREE.sRGBEncoding; //these lines =^ line just to make sure that its possible to display render properly in device
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(25,25,25);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);

scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0); //make sure that camera is looking at the origin of the scene
controls.dampingFactor = 0.05; 
controls.enableDamping = true; // these lines =^ smoothen out the movement of camera


function createCylinder(x,y,z) {
    const geometry = new THREE.CylinderGeometry(5, 5, y, 6, y);
    const material = new THREE.MeshStandardMaterial({color: 0xA21D00});
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = x;
    cylinder.position.y = y/2;
    cylinder.position.z = z;
    scene.add(cylinder);
}

createCylinder(5,6,8);
createCylinder(0,9,0);
createCylinder(-5,6,-8);
createCylinder(5,6,-8);
createCylinder(-5,6,8);
createCylinder(10,6,0);
createCylinder(-10,6,0);

let envmap;

(async function() {
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync("assets/envmap.hdr");
    envmap = pmrem.fromEquirectangular(envmapTexture).texture;

    makeHex(10, new Vector2(0, 0));

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
})();

let hexagonGeometries = new THREE.BoxGeometry(0,0,0);

function hexGeometry(height, position) {
    let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
    geo.translate(position.x, height * 0.5, position.y);
    
    return geo;
}

function makeHex(height, position) {
    let geo = hexGeometry(height, position);
    hexagonGeometries = mergeBufferGeometries([hexagonGeometries, geo]);
}
