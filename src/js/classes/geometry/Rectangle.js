import { EditorObject } from "../EditorObject.js";
import { Point } from "./Point.js";

class Rectangle extends EditorObject{
    constructor(cent,w,h,ctx){
        super(cent,w,h)
        this.type = "Rectangle"
        this.svg = ctx.makeRectangle(cent.x,cent.y,w,h)
    }
    getCorners(){
        let lt = new Point(this.center.x-this.w/2,this.center.y-this.h/2)
        let rt = new Point(this.center.x+this.w/2,this.center.y-this.h/2)
        let ld = new Point(this.center.x-this.w/2,this.center.y+this.h/2)
        let rd = new Point(this.center.x+this.w/2,this.center.y+this.h/2)
        return [lt,rt,rd,ld]
    }
}

export {Rectangle as default}