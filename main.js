import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DoubleSide, Material, Mesh, MeshStandardMaterial, Vector2 } from 'three';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@3.0.0';

const names = ["Arouca", "Espinho", "Gondomar", "Maia", "Matosinhos", "Oliveira de Azeméis", "Paredes", "Porto", "Póvoa de Varzim", "Santa Maria da Feira", "Santo Tirso", "São João da Madeira", "Trofa", "Vale de Cambra", "Valongo", "Vila do Conde", "Vila Nova de Gaia"];
const longitudes = [-50.0000, 26.6951, 50.0000, 22.8206, 37.4080, -5.0756, 33.4754, 24.3898, 49.9225, 8.7369, -5.6955, -2.4215, 11.0035, -20.8446, -0.9492, 47.4041, 21.0384];
const latitudes = [-42.6618, -36.7615, 50.0000, -19.4217, -22.8394, -50.0000, -21.2052, -24.9214, -7.4403, -43.0783, -10.3708, -45.1446, -10.6851, -49.6622, -22.5016, -9.6952, -27.5927];
const heights = [15.6250, 34.3750, 12.5000, 43.7500, 21.8750, 46.8750, 0.0000, 37.5000, 25.0000, 6.2500, 40.6250, 18.7500, 28.1250, 3.1250, 50.0000, 9.3750, 31.2500];

console.log(names.length);
console.log(longitudes.length);
console.log(latitudes.length);
console.log(heights.length);

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

    for(let i = -20; i <= 20; i++){ 
        for(let j = -20; j <= 20; j++){ // ^= amount of Hexagones
            let position = tileToPosition(i,j);
            if(position.length() > 20) continue; //radius of the map

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

    for(let i = 0; i < 17; i++){ 
        let position = tileToPosition(Math.round(latitudes[i]), Math.round(longitudes[i]));            
        makeWarehouse(Math.round(heights[i]/2), position);
        makePlane(Math.round(heights[i]/2), position);
        
    }

    let planeMesh = new Mesh(
        planeGeometries,
        new MeshStandardMaterial({
            color: 0xFF0000,
            envMap: envmap,
            flatShading: true,
            side: THREE.DoubleSide
        })
        
    )
    scene.add(planeMesh);

    let warehouseMesh = new Mesh(
        warehouseGeometries,
        new MeshStandardMaterial({
            color: 0xFFFFFF,
            envMap: envmap,
            flatShading: true,
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

// function makePlane(x,y,z) {
//     const geometry = new THREE.PlaneGeometry(6, 6);
//     const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
//     const plane = new THREE.Mesh( geometry, material );
//     plane.position.setX(x);
//     plane.position.setY(y);
//     plane.position.setZ(z);
//     scene.add(plane);
// }

let planeGeometries = new THREE.BoxGeometry(0,0,0);

function planeGeometry(height, position) {
    let geo = new THREE.PlaneGeometry(3,3);
    geo.rotateX(-Math.PI * 0.5);
    geo.translate(position.x, height, position.y);
    
    return geo;
}

function makePlane(height, position) {
    let geo = planeGeometry(height, position);
    planeGeometries = mergeBufferGeometries([planeGeometries, geo]);
}