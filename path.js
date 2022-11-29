import * as THREE from "three";
import { Scene } from "three";

/*
 * parameters = {
 *  begining: Vector3,
 *  end: Vector3,
 * }
 */

export default class RoadLine extends THREE.Line {
    constructor(parameters){
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        //this.halfSize = this.
        //this.geometry = new THREE.PlaneGeometry(3,5);
        //this.material = new THREE.MeshBasicMaterial({color:0x564545});
            let begining = this.begining;
            let end = this.end;

            let xi=begining.x, yi=begining.y, zi=begining.z;
            let xj=end.x, yj=end.y, zj=end.z;
            
            let ri=1.5;
            let K_LIGACAO=1.5;
            let rj=1.5;
            let sj=K_LIGACAO*rj;

            let si=K_LIGACAO*ri;
            let alpha = Math.atan2((xj - xi),(zj - zi));//*180/Math.PI;
            
            console.log('xi: ' + xi);
            console.log('yi: ' + yi);
            console.log('zi: ' + zi);
            console.log('xj: ' + xj);
            console.log('yj: ' + yj);
            console.log('zj: ' + zj);

            console.log(alpha);

            let startSlopeX=xi+si*Math.sin(alpha);
            let startSlopeZ=zi+si*Math.cos(alpha);
            
            let endSlopeX=xj-sj*Math.sin(alpha);
            let endSlopeZ=zj-sj*Math.cos(alpha);

            console.log('startSlopeX: ' + startSlopeX);
            console.log('startSlopeZ: ' + startSlopeZ);
            console.log('endSlopeX: ' + endSlopeX);
            console.log('endSlopeZ: ' + endSlopeZ);


            const materialLine = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            

            const points = [];
            points.push( new THREE.Vector3( xi, yi - 0.001, zi ) );
            points.push( new THREE.Vector3( startSlopeX, yi - 0.001, startSlopeZ ) );
            points.push( new THREE.Vector3( endSlopeX, yj - 0.001, endSlopeZ ) );
            points.push( new THREE.Vector3( xj, yj - 0.001, zj ) );
            

            const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
            this.material = materialLine;
            this.geometry=geometryLine;
        
        }    
}