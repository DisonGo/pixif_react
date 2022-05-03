import { EditorObject } from "../EditorObject.js";

class Circle extends EditorObject{
    constructor(cent,r,ctx){
        super(cent,r*2,r*2)
        this.type = "Circle"
        this.r = r
        this.svg = ctx.makeCircle(cent.x,cent.y,r)
    }
}

export {Circle as default}