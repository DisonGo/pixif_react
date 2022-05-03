import { Point } from "./geometry/Point.js";

export class EditorObject{
    constructor(center,w,h){
        this.center = Point.clone(center)
        this.w = w
        this.h = h
        this.collisionOn = false
        this.type = "EditorObject"
        this.CalcCorners()
    }
    set setCenter(p){
        this.center = Point.clone(p)
        this.translation = this.center
    }
    set translation(p){
        let vector = Point.PToTwoVector(p)
        this.svg.translation = vector
    }
    CalcCorners(){
        this.beg = new Point(this.center.x-this.w/2,this.center.y-this.h/2)
        this.end = new Point(this.center.x+this.w/2,this.center.y+this.h/2)
    }
    Status(){
        console.log(`Type:\t${this.type}\n`+
                            `Center:\t(${this.center.x},${this.center.y})\n`+
                            `Width:\t${this.w}\n`+
                            `Height:\t${this.h}`);
    }
}