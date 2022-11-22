import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Mesh, MeshStandardMaterial, Vector2 } from 'three';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@3.0.0';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.outputEncoding = THREE.sRGBEncoding; //these lines =^ line just to make sure that its possible to display render properly in device
renderer.setClearColor(0x007500, 1);
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


// function createCylinder(x,y,z) {
//     const geometry = new THREE.CylinderGeometry(5, 5, y, 6, y);
//     const material = new THREE.MeshStandardMaterial({color: 0xA21D00});
//     const cylinder = new THREE.Mesh(geometry, material);
//     cylinder.position.x = x;
//     cylinder.position.y = y/2;
//     cylinder.position.z = z;
//     scene.add(cylinder);
// }

// createCylinder(5,6,8);
// createCylinder(0,9,0);
// createCylinder(-5,6,-8);
// createCylinder(5,6,-8);
// createCylinder(-5,6,8);
// createCylinder(10,6,0);
// createCylinder(-10,6,0);

let envmap;

(async function() {
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync("assets/envmap.hdr");
    envmap = pmrem.fromEquirectangular(envmapTexture).texture;

    const simplex = new SimplexNoise();

    for(let i = -30; i <= 30; i++){ 
        for(let j = -30; j <= 30; j++){ // ^= amount of Hexagones
            let position = tileToPosition(i,j);
            if(position.length() > 40) continue; //radius of the map

            let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
            noise = Math.pow(noise, 1.5);

            makeHex(noise * 10, position);
        }
    }

    let hexagonMesh = new Mesh(
        hexagonGeometries,
        new MeshStandardMaterial({
            color: 0x000000,
            envMap: envmap,
            flatShading: true
        })
    )
    scene.add(hexagonMesh);

    for(let i = -10; i <= 10; i++){ 
        let position = tileToPosition(i, Math.floor(Math.random() * -30) + 15);
        if(position.length() > 40) continue; //radius of the map
        
        makeWarehouse(10, position);
        
    }

    let warehouseMesh = new Mesh(
        warehouseGeometries,
        new MeshStandardMaterial({
            color: 0xFFFFFF,
            envMap: envmap,
            flatShading: true
        })
    )
    scene.add(warehouseMesh);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
})();

function tileToPosition(tileX, tileY) {
    return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}

let hexagonGeometries = new THREE.BoxGeometry(0,0,0);

function hexGeometry(height, position) {
    let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false); //I could use the the cylinder value of thetaLength 
    geo.translate(position.x, height * 0.5, position.y);
    
    return geo;
}

function makeHex(height, position) {
    let geo = hexGeometry(height, position);
    hexagonGeometries = mergeBufferGeometries([hexagonGeometries, geo]);
}

let warehouseGeometries = new THREE.BoxGeometry(0,0,0);

function makeWarehouse(height, position) {
    let geo = hexGeometry(height, position);
    warehouseGeometries = mergeBufferGeometries([warehouseGeometries, geo]);
}