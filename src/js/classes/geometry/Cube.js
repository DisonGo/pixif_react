import { EditorObject } from "../EditorObject.js";
import { Point } from "./Point.js";

class Cube extends EditorObject{
    constructor(cent,size,ctx){
        super(cent,size,size)
        this.size = size
        this.type = "Cube"
        this.svg = ctx.makeRectangle(cent.x,cent.y,size,size)
        this.svg.linewidth = 0
        this.svg.stroke = "cyan"
    }
    ConfElem(){
        this.elem = this.svg._renderer.elem
    }
    getCorners(){
        let C = this.center,
            W = this.w,
            H = this.h,
            lt = new Point(C.x-W/2,C.y-H/2),
            rt = new Point(C.x+W/2,C.y-H/2),
            ld = new Point(C.x-W/2,C.y+H/2),
            rd = new Point(C.x+W/2,C.y+H/2)
        return [lt,rt,rd,ld]
    }
    set fill(color){
        this.svg.fill = color
    }
    get fill(){
        return this.svg.fill
    }
    set stroke(color){
        this.svg.stroke = color
    }
    get stroke(){
        return this.svg.stroke
    }
}

export {Cube as default}