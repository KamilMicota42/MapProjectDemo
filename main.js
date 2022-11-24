import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@3.0.0';

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
            if(position.length() > 19) continue; //radius of the map

            let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
            noise = Math.pow(noise, 1.5);

            makeHex(noise * 10, position);
        }
    }

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
        let position = tileToPosition(Math.round(latitudes[i]), Math.round(longitudes[i]));   
        makeWarehouse(Math.round(heights[i]/2), position);
        makeCircle(Math.round(heights[i]/2) + 0.01, position); // flicking bug solved in dummy way
    }

    let warehouseMesh = new THREE.Mesh(
        warehouseGeometries,
        new THREE.MeshStandardMaterial({
            color: 0xE4E5E8,
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
    
    makePath(10, 12);


    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
})();

function tileToPosition(tileX, tileY) {
    return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
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

// let linkElementGeometries = new THREE.BoxGeometry(0,0,0);

// function linkElementGeometry(height, position) {
//     let geo = new THREE.PlaneGeometry(1, 2);
//     geo.rotateX(-Math.PI * 0.5);
//     geo.translate(position.x, height, position.y);
    
//     return geo;
// }

// function makeLinkElement(height, position) {
//     let geo = linkElementGeometry(height, position);
//     linkElementGeometries = mergeBufferGeometries([linkElementGeometries, geo]);
// }

function makePath(i, j) {
    let position1 = tileToPosition(Math.round(latitudes[i]), Math.round(longitudes[i])); 
    let position2 = tileToPosition(Math.round(latitudes[j]), Math.round(longitudes[j]));
    
    var dx = position1.x - position2.x;
    var dy = position1.y - position2.y;
    var dz = Math.round(heights[i]/2) - Math.round(heights[j]/2);

    let alpha = Math.atan2((latitudes[j] - latitudes[i]),(heights[j] - heights[i]));
    let distance = Math.sqrt( dx * dx + dy * dy + dz * dz );
    
    const plane = new THREE.PlaneGeometry( 1, distance );
    const material = new THREE.MeshBasicMaterial( {color: 0xcccff, side: THREE.DoubleSide} );
    const linkElement = new THREE.Mesh( plane, material )
    linkElement.rotateX(Math.PI * 0.5);
    linkElement.rotateZ(alpha);
    linkElement.position.setX((position1.x + position2.x)/2);
    linkElement.position.setY((Math.round(heights[i]/2) + Math.round(heights[j]/2))/2);
    linkElement.position.setZ((position1.y + position2.y)/2);
    scene.add( linkElement );

    // const plane2 = new THREE.PlaneGeometry( 1, 2 );
    // const material2 = new THREE.MeshBasicMaterial( {color: 0xcccff, side: THREE.DoubleSide} );
    // const linkElement2 = new THREE.Mesh( plane2, material2 );
    // linkElement2.rotateX(Math.PI * 0.5);
    // linkElement2.position.setX(position2.x);
    // linkElement2.position.setY(Math.round(heights[j]/2)+1);
    // linkElement2.position.setZ(position2.y);
    // scene.add( linkElement2 );


    // const points = [];
    // points.push( new THREE.Vector3( position1.x + 0.5, Math.round(heights[i]/2), position1.y + 0.5) );
    // points.push( new THREE.Vector3( position1.x - 0.5, Math.round(heights[i]/2), position1.y - 0.5) );
    // points.push( new THREE.Vector3( position2.x - 0.5, Math.round(heights[j]/2), position2.y - 0.5) );
    // points.push( new THREE.Vector3( position2.x + 0.5, Math.round(heights[j]/2), position2.y + 0.5) );
    // const indices = [0, 1, 3, 1, 2, 3];
    // const path = new THREE.BufferGeometry()
    // .setFromPoints( points );
    // path.setIndex(new THREE.BufferAttribute(
    // new Uint16Array(indices), 1));
    
    // let pathMesh = new THREE.Mesh(
    //     path,
    //     new THREE.MeshStandardMaterial({
    //         color: 0x4D0011,
    //         envMap: envmap,
    //         flatShading: true,
    //         side: THREE.DoubleSide
    //     })
    // )

    // scene.add(pathMesh);
}
