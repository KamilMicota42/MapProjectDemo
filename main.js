import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Vector2, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


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
const longitudes = [-50.0000, 26.6951, 50.0000, 22.8206, 37.4080, -5.0756, 33.4754, 24.3898, 49.9225, 8.7369, -5.6955, -2.4215, 11.0035, -20.8446, -0.9492, 47.4041, 23.0384];
const latitudes = [-42.6618, -36.7615, 50.0000, -19.4217, -22.8394, -50.0000, -21.2052, -24.9214, -7.4403, -43.0783, -10.3708, -45.1446, -10.6851, -49.6622, -22.5016, -9.6952, -27.5927];
const heights = [15.6250, 34.3750, 12.5000, 43.7500, 21.8750, 46.8750, 0.0000, 37.5000, 25.0000, 6.2500, 40.6250, 18.7500, 28.1250, 3.1250, 50.0000, 9.3750, 31.2500];
const rotations = [(Math.PI*2/17) * 1, (Math.PI*2/17) * 2, (Math.PI*2/17) * 3, (Math.PI*2/17) * 4, (Math.PI*2/17) * 5, (Math.PI*2/17) * 6, (Math.PI*2/17) * 7, (Math.PI*2/17) * 8, (Math.PI*2/17) * 9, (Math.PI*2/17) * 10, (Math.PI*2/17) * 11, (Math.PI*2/17) * 12, (Math.PI*2/17) * 13, (Math.PI*2/17) * 14, (Math.PI*2/17) * 15, (Math.PI*2/17) * 16, (Math.PI*2/17) * 17]; //from 1 to math.pi * 2




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
controls.target.set(0,0,0);
controls.dampingFactor = 0.05; 
controls.enableDamping = true;
//controls.target.set(latitudes[12],heights[12]/2,longitudes[12]);

let envmap;

(async function() {
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync("assets/envmap.hdr");
    envmap = pmrem.fromEquirectangular(envmapTexture).texture;

    for(let i = 0; i < 17; i++){ 
        let position = new Vector2(latitudes[i], longitudes[i]);   
        makeWarehouseHexagon(heights[i]/2, position);
        makeWarehouseModel(heights[i]/2 + 0.02, position, rotations[i]);
        makeCircle(heights[i]/2 + 0.01, position);
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

    let warehouseMesh = new THREE.Mesh(
        warehouseGeometries,
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            envMap: envmap,
            flatShading: true,
        })
    )
    scene.add(warehouseMesh);

    const roundaboutTexture = new THREE.TextureLoader().load( 'assets/roundaboutText.jpg' );
    let circleMesh = new THREE.Mesh(
        circleGeometries,
        new THREE.MeshStandardMaterial({
            color: 0x4B443C,
            envMap: envmap,
            flatShading: true,
            side: THREE.DoubleSide,
            map: roundaboutTexture
        })
        
    )
    scene.add(circleMesh);
    
    makePath(10, 14);
    makePath(10, 12);
    makePath(12, 6);
    makePath(12, 2);
    makePath(12, 11);
    makePath(0, 13);
    makePath(13, 11);
    makePath(11, 9);
    makePath(9, 4);
    makePath(4, 8);
    makePath(14, 1);
    makePath(14, 5);
    makePath(6, 15);
    makePath(5, 16);
    makePath(14, 3);
    makePath(7, 1);

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

let warehouseGeometries = new THREE.BoxGeometry(0,0,0);

function makeWarehouseHexagon(height, position) {
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

function makeWarehouseModel(height1, position1, rotation){
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/scene.gltf', (glftScene) => {
        glftScene.scene.scale.set(0.3,0.3,0.3);
        glftScene.scene.position.x = position1.x;
        glftScene.scene.position.z = position1.y;
        glftScene.scene.position.y = height1;
        glftScene.scene.rotateY(rotation); //Rotation of the warehouses
        scene.add(glftScene.scene)
    })
}

function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

function distanceVectorXZ( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dz * dz );
}

function makePath(i, j) {
    
    let position1 = new Vector3( latitudes[i], heights[i]/2, longitudes[i]);
    let position2 = new Vector3( latitudes[j], heights[j]/2, longitudes[j]);

    console.log(position1);
    console.log(position2);

    let xi=position1.x, yi=position1.y, zi=position1.z;
    let xj=position2.x, yj=position2.y, zj=position2.z;
            
    let ri=1.5;
    let K_LIGACAO=1.5;
    let rj=1.5;
    let sj=K_LIGACAO*rj;

    let si=K_LIGACAO*ri;
    let alpha = Math.atan2((xj - xi),(zj - zi));//*180/Math.PI;

    console.log(alpha);

    let startSlopeX=xi+si*Math.sin(alpha);
    let startSlopeZ=zi+si*Math.cos(alpha);
            
    let endSlopeX=xj-sj*Math.sin(alpha);
    let endSlopeZ=zj-sj*Math.cos(alpha);

    const points = []; 
    points.push( new THREE.Vector3( xi, yi, zi) );
    points.push( new THREE.Vector3( startSlopeX, yi, startSlopeZ) );
    points.push( new THREE.Vector3( endSlopeX, yj, endSlopeZ) );
    points.push( new THREE.Vector3( xj, yj, zj) );
            
    const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
    const materialLine = new THREE.LineBasicMaterial({
        color: 0x4D0011
    });
    const line = new THREE.Line( geometryLine, materialLine );
    scene.add(line);

    console.log('\nCenter:');
    console.log('First linking part X: ' + (xi + startSlopeX)/2);
    console.log('First linking part Y: ' + yi);
    console.log('First linking part Z: ' + (zi + startSlopeZ)/2);

    console.log('\nSecond linking part X: ' + (xj + endSlopeX)/2);
    console.log('Second linking part Y: ' + yj);
    console.log('Second linking part Z: ' + (zj + endSlopeZ)/2);

    console.log('\nSlope X: ' + (startSlopeX + endSlopeX)/2);
    console.log('Slope Y: ' + (yi + yj)/2);
    console.log('Slope Z: ' + (startSlopeZ + endSlopeZ)/2);

    let distanceFirstLink = distanceVector(new THREE.Vector3(xi, yi, zi), new THREE.Vector3(startSlopeX, yi, startSlopeZ));
    let distanceSlope = distanceVector(new THREE.Vector3(startSlopeX, yi, startSlopeZ), new THREE.Vector3(endSlopeX, yj, endSlopeZ));
    let distanceSecLink = distanceVector(new THREE.Vector3(endSlopeX, yj, endSlopeZ), new THREE.Vector3(xj, yj, zj));

    let p = distanceVectorXZ(new THREE.Vector3(startSlopeX, yi, startSlopeZ), new THREE.Vector3(endSlopeX, yj, endSlopeZ));
    let hij = yi - yj;
    let inclinacao = Math.atan2(p,hij);

    const roadTexture = new THREE.TextureLoader().load( 'assets/roadText.jpg' );

    //FIRST LINK ELEMENT
    const geometryFirstLinkEle = new THREE.PlaneGeometry(1, distanceFirstLink);
    const materialFirstLinkEle = new THREE.MeshBasicMaterial({
        color: 0x53565a, 
        side: THREE.DoubleSide,
        map: roadTexture
    });
    const planeFirstLinkEle = new THREE.Mesh( geometryFirstLinkEle, materialFirstLinkEle );
    planeFirstLinkEle.position.set((xi + startSlopeX)/2, yi, (zi + startSlopeZ)/2);

    planeFirstLinkEle.rotateY(alpha);
    planeFirstLinkEle.rotateX(Math.PI*0.5);
    
    scene.add( planeFirstLinkEle );

    //SLOPE ELEMENT
    const geometrySlope = new THREE.PlaneGeometry(1, distanceSlope);
    const materialSlope = new THREE.MeshBasicMaterial({
        color: 0x53565a, 
        side: THREE.DoubleSide,
        map: roadTexture
    });
    const planeSlope = new THREE.Mesh( geometrySlope, materialSlope );
    planeSlope.position.set((startSlopeX + endSlopeX)/2, (yi+yj)/2, (startSlopeZ + endSlopeZ)/2);
    
    planeSlope.rotateY(alpha);
    planeSlope.rotateX(-inclinacao);

    scene.add( planeSlope );

    //SECOND LINK ELEMENT
    const geometrySecLinkEle = new THREE.PlaneGeometry(1, distanceSecLink);
    const materialSecLinkEle = new THREE.MeshBasicMaterial({
        color: 0x53565a, 
        side: THREE.DoubleSide,
        map: roadTexture
    });
    const planeSecLinkEle = new THREE.Mesh( geometrySecLinkEle, materialSecLinkEle );
    planeSecLinkEle.position.set((xj + endSlopeX)/2, yj, (zj + endSlopeZ)/2);
    
    planeSecLinkEle.rotateY(alpha);
    planeSecLinkEle.rotateX(Math.PI*0.5);

    scene.add( planeSecLinkEle );
}