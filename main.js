import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import RoadLine from './path';
import { Vector2, Vector3 } from 'three';

// Pallete used in project
// Cool Gray
// #E4E5E8

// Gunmetal Gray
// #53565A

// Burgundy
// #4D0011

// Olive Green
// #4B443C



const names = ["Arouca", "Espinho", "Gondomar", "Maia", "Matosinhos", "Oliveira de Azeméis", "Paredes", "Porto", "Póvoa de Varzim", "Santa Maria da Feira", "Santo Tirso", "São João da Madeira", "Trofa", "Vale de Cambra", "Valongo", "Vila do Conde", "Vila Nova de Gaia"];
const longitudes = [-50.0000, 26.6951, 50.0000, 22.8206, 37.4080, -5.0756, 33.4754, 24.3898, 49.9225, 8.7369, -5.6955, -2.4215, 11.0035, -20.8446, -0.9492, 47.4041, 21.0384];
const latitudes = [-42.6618, -36.7615, 50.0000, -19.4217, -22.8394, -50.0000, -21.2052, -24.9214, -7.4403, -43.0783, -10.3708, -45.1446, -10.6851, -49.6622, -22.5016, -9.6952, -27.5927];
const heights = [15.6250, 34.3750, 12.5000, 43.7500, 21.8750, 46.8750, 0.0000, 37.5000, 25.0000, 6.2500, 40.6250, 18.7500, 28.1250, 3.1250, 50.0000, 9.3750, 31.2500];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.outputEncoding = THREE.sRGBEncoding; //these lines =^ line just to make sure that its possible to display render properly in device
renderer.setClearColor(0x53565A, 1);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(25,25,25);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
const axesHelper = new THREE.AxesHelper( 50 );

scene.add(lightHelper, gridHelper, axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0); //make sure that camera is looking at the origin of the scene
controls.dampingFactor = 0.05; 
controls.enableDamping = true; // these lines =^ smoothen out the movement of camera

let envmap;

(async function() {
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync("assets/envmap.hdr");
    envmap = pmrem.fromEquirectangular(envmapTexture).texture;

    let hexagonMesh = new THREE.Mesh(
        hexagonGeometries,
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            envMap: envmap,
            flatShading: true
        })
    )
    scene.add(hexagonMesh);         
        
    for(let i = 0; i < 17; i++){ 
        let position = new Vector2(latitudes[i], longitudes[i]);   
        makeWarehouse(heights[i]/2, position);
        makeCircle(heights[i]/2 + 0.01, position); // flicking bug solved in dummy way
    }

    let warehouseMesh = new THREE.Mesh(
        warehouseGeometries,
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            envMap: envmap,
            flatShading: true,
        })
    )
    scene.add(warehouseMesh);

    let circleMesh = new THREE.Mesh(
        circleGeometries,
        new THREE.MeshStandardMaterial({
            color: 0x4D0011,
            envMap: envmap,
            flatShading: true,
            side: THREE.DoubleSide
        })
        
    )
    scene.add(circleMesh);
    
    makePath(15, 12);


    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
})();

let hexagonGeometries = new THREE.BoxGeometry(0,0,0);

function hexGeometry(height, position) {
    let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false); //I could use the the cylinder value of thetaLength 
    geo.translate(position.x, height * 0.5, position.y);
    
    return geo;
}

let warehouseGeometries = new THREE.BoxGeometry(0,0,0);

function makeWarehouse(height, position) {
    let geo = hexGeometry(height, position);
    warehouseGeometries = mergeBufferGeometries([warehouseGeometries, geo]);
}

let circleGeometries = new THREE.BoxGeometry(0,0,0);

function circleGeometry(height, position) {
    let geo = new THREE.CircleGeometry(1, 32);
    geo.rotateX(-Math.PI * 0.5);
    geo.translate(position.x, height, position.y);
    
    return geo;
}

function makeCircle(height, position) {
    let geo = circleGeometry(height, position);
    circleGeometries = mergeBufferGeometries([circleGeometries, geo]);
}

function makePath(i, j) {
    
    let position1 = new Vector3( latitudes[i], heights[i]/2, longitudes[i]);
    let position2 = new Vector3( latitudes[j], heights[j]/2, longitudes[j]);

    console.log(position1);
    console.log(position2);

    const path = new RoadLine({
        begining: position1,
        end: position2
    });
    scene.add(path);
}
