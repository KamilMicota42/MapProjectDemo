import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Mesh } from 'three';


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
const width = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.5, 0.6, 0.7, 0.8, 0.9, 0.5, 0.6, 0.7, 0.5, 0.6, 0.7]; //from 0.3 to 1



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
//^^^ increase the realism of the graphic representation, through adequate lighting

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
const axesHelper = new THREE.AxesHelper( 50 );

scene.add(lightHelper, gridHelper, axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.dampingFactor = 0.05; 
controls.enableDamping = true;

let envmap;

(async function() {
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync("assets/envmap.hdr");
    envmap = pmrem.fromEquirectangular(envmapTexture).texture;

    for(let i = 0; i < 17; i++){ 
        let position = new Vector2(latitudes[i], longitudes[i]);   
        //makeWarehouseHexagon(heights[i]/2, position);
        //makeWarehouseModel(heights[i]/2 + 0.02, position, rotations[i]);
        makeCircle(heights[i]/2 + 0.01, position);
    }

    //example of truck
    //const truck = makeTruckModel(heights[10]/2+0.1, new Vector2(latitudes[10], longitudes[10]+0.7));
    
    

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
    
    makePath(10, 14, width[0]);
    makePath(10, 12, width[1]);
    makePath(12, 6, width[2]);
    makePath(12, 2, width[3]);
    makePath(12, 11, width[4]);
    makePath(0, 13, width[5]);
    makePath(13, 11, width[6]);
    makePath(11, 9, width[7]);
    makePath(9, 4, width[8]);
    makePath(4, 8, width[9]);
    makePath(14, 1, width[10]);
    makePath(14, 5, width[11]);
    makePath(6, 15, width[12]);
    makePath(5, 16, width[13]);
    makePath(14, 3, width[14]);
    makePath(7, 1, width[15]);

    renderer.setAnimationLoop(() => {
        controls.update();
        controls.target = new THREE.Vector3(latitudes[10], heights[10]/2 + 2, longitudes[10]); //there goes truck object
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
    glftLoader.load('./assets/warehouseModel/scene.gltf', (glftScene) => {
        glftScene.scene.scale.set(0.3,0.3,0.3);
        glftScene.scene.position.x = position1.x;
        glftScene.scene.position.z = position1.y;
        glftScene.scene.position.y = height1;
        glftScene.scene.rotateY(rotation); //Rotation of the warehouses
        scene.add(glftScene.scene)
    })
}

function makeTruckModel(height1, position1){
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/truckModel/scene.gltf', (glftScene) => {
        glftScene.scene.scale.set(1,1,1);
        glftScene.scene.position.x = position1.x;
        glftScene.scene.position.z = position1.y;
        glftScene.scene.position.y = height1;
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

function makePath(i, j, w) {
    
    let position1 = new Vector3( latitudes[i], heights[i]/2, longitudes[i]);
    let position2 = new Vector3( latitudes[j], heights[j]/2, longitudes[j]);

    console.log(position1);
    console.log(position2);

    let xi=position1.x, yi=position1.y, zi=position1.z;
    let xj=position2.x, yj=position2.y, zj=position2.z;
            
    let ri=1.5;
    let K_LINK=1.5;
    let rj=1.5;
    let sj=K_LINK*rj;

    let si=K_LINK*ri;
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
    const geometryFirstLinkEle = new THREE.PlaneGeometry(w, distanceFirstLink);
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
    const geometrySlope = new THREE.PlaneGeometry(w, distanceSlope);
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
    const geometrySecLinkEle = new THREE.PlaneGeometry(w, distanceSecLink);
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


//const truck = makeTruckModel(heights[10]/2+0.1, new Vector2(latitudes[10], longitudes[10]+0.7));


window.addEventListener('keydown', (event) => {
    console.log(`Keydown event triggered: ${event.code}`, sphere.position);
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);

sphere.position.set(latitudes[10], heights[10]/2 + sphere.geometry.parameters.radius, longitudes[10]+0.7);
scene.add(sphere);

const speed = 0.05;
let direction = 0;
console.log(sphere.position);


function move(key) {
  if (key === 'a') {
      // Rotate the character counterclockwise
    direction -= 4*Math.PI / 180;
  } else if (key === 'd') {
    // Rotate the character clockwise
    direction += 4*Math.PI / 180;
  } else if (key === 'w') {
    // Update the character's position based on its velocity and direction
    sphere.position.x += speed * Math.cos(direction);
    sphere.position.z += speed * Math.sin(direction);
  } else if (key === 's') {
    // Update the character's position based on its velocity and direction, but in the opposite direction
    sphere.position.x -= speed * Math.cos(direction);
    sphere.position.z -= speed * Math.sin(direction);
  }
  for (let i = 0; i < names.length; i++) {
    // Check if the sphere is within the circle representing the node
    const dx = sphere.position.x - longitudes[i];
    const dz = sphere.position.z - latitudes[i];
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance <= width[i]) {
      currentNode = i; // Update the current node
      sphere.position.x = longitudes[i]; // Snap the sphere to the node
      sphere.position.z = latitudes[i];
      sphere.position.y = heights[i] + sphere.geometry.parameters.radius; // Adjust height to match sphere height
      direction = rotations[i];
      break; // Stop checking for collisions with other nodes
    }
    // Check if the sphere is within the connecting element between this node and each of its neighbors
    for (let j = 0; j < longitudes.length; j++) {
      if (i !== j) {
        // Calculate the angle between the connecting element and the x-axis
        const angle = Math.atan2(latitudes[j] - latitudes[i], longitudes[j] - longitudes[i]);
  
        // Calculate the sphere's position in the new coordinate system
        const x = (sphere.position.x - longitudes[i]) * Math.cos(angle) + (sphere.position.z - latitudes[i]) * Math.sin(angle);
        const z = (sphere.position.z - latitudes[i]) * Math.cos(angle) - (sphere.position.x - longitudes[i]) * Math.sin(angle);
          // Calculate the slope of the connecting element
        const slope = (heights[j] - heights[i]) / (longitudes[j] - longitudes[i]);
        const y = slope * (sphere.position.x - longitudes[i]) + heights[i];

        // Calculate the y-intercept of the connecting element
        const intercept = heights[i] - slope * longitudes[i];
        // Calculate the x-coordinate of the point on the connecting element that is closest to the sphere's current position
        const xClosest = (sphere.position.x + slope * sphere.position.z - slope * intercept) / (1 + slope **2);

        // Calculate the z-coordinate of the point on the connecting element that is closest to the sphere's current position
        const zClosest = (sphere.position.z + slope * sphere.position.x - intercept) / (1 + 1 / slope ** 2);
        
        
        // Calculate the distance between the sphere's current position and the closest point on the connecting element
        const distance = Math.sqrt((xClosest - sphere.position.x) ** 2 + (zClosest - sphere.position.z) ** 2);
        
        // Check if the distance is within the width of the connecting element
        if (distance <= width[i] / 2) {
          // Calculate the y-coordinate of the point on the connecting element that is closest to the sphere's current position
          const y = slope * (sphere.position.x - longitudes[i]) + heights[i];
          sphere.position.y = y;
          // Check if the point on the connecting element that is closest to the sphere's current position is within the limits of the connecting element
          if (x > -width[i] / 2 && x < width[i] / 2) {
            // Update the sphere's position to the point on the connecting element that is closest to its current position
            sphere.position.x = xClosest;
            sphere.position.z = zClosest;
            // Adjust height to match the height of the connecting element
            direction=angle;
            
          }
        }
      }
    }
  }
}
  

window.addEventListener('keydown', event => {
  move(event.key);
});
//console.log(j);


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

//-3.381864920450932
//stickToRoad(){
  //force character to be on the road:
    //1) need to be "planted" to it 
      // sphere.position.y+ sphere.geometry.parameters.radius = pathHeight ()
    //2) can not go outside the width
//}

animate();


