import * as THREE from "three";

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
            
            let ri=1;
            let K_LIGACAO=1.5;
            let rj=1;
            let sj=K_LIGACAO*rj;

            let si=K_LIGACAO*ri;
            let alpha = Math.atan2((yj - yi),(xj - xi));//*180/Math.PI;
            
            console.log('xi: ' + xi);
            console.log('yi: ' + yi);
            console.log('zi: ' + zi);
            console.log('xj: ' + xj);
            console.log('yj: ' + yj);
            console.log('zj: ' + zj);

            console.log(alpha);



            let startSlopeX=xi+si*Math.cos(alpha);
            let startSlopeY=yi+si*Math.sin(alpha);
            
            let endSlopeX=xj-sj*Math.cos(alpha);
            let endSlopeY=yj-sj*Math.sin(alpha);

            console.log('startSlopeX: ' + startSlopeX);
            console.log('startSlopeY: ' + startSlopeY);
            console.log('endSlopeX: ' + endSlopeX);
            console.log('endSlopeY: ' + endSlopeY);


            const material3 = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            ;

            const points = [];
            points.push( new THREE.Vector3( startSlopeX, yi, zi ) );
            points.push( new THREE.Vector3( xi, startSlopeY, zi ) );
            points.push( new THREE.Vector3( endSlopeX, endSlopeY, zj ) );
            points.push( new THREE.Vector3( xj, yj, zj ) );

            const geometry3 = new THREE.BufferGeometry().setFromPoints( points );
            this.material = material3;
            this.geometry=geometry3;

        }
    
    
}