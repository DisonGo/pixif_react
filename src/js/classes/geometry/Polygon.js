import { EditorObject } from "../EditorObject.js";
import { Point } from "./Point.js";

class Polygon extends EditorObject{
    constructor(center,ctx,vertices){
        super(center,100,100)
        this.type = "Polygon"
        let anchors = []
        vertices.forEach((vert)=>{
            anchors.push(Point.PToTwoVector(vert))
        })
        this.vertices = vertices
        this.svg = ctx.makePath(anchors)
        this.center = new Point(this.svg.position.x,this.svg.position.y)
        this.translation = center
    }
    set translation(p){
        let vector = Point.PToTwoVector(p)
        this.svg.translation = vector
        let delta = Point.deltaVector(this.center,p)
        this.vertices.forEach((vert)=>{
            vert.sumPoint(delta)
        })
        this.center.copy(p)
    }
}
export {Polygon as default}