import { EditorObject } from "../EditorObject.js";
import { Point } from "./Point.js";

class Cube extends EditorObject{
    modes = {
        normal:{
            strokeWidth:0,
            color:"white",
            size:0
        },
        preview:{
            strokeWidth:2,
            color:"black",
            _size: 0, 
            set size(size){
                this._size = size - this.strokeWidth
            },
            get size(){
                return this._size
            }
        }
    }
    constructor(cent,size,ctx,mode = "normal"){
        super(cent,size,size)
        this.size = size
        this.modes.normal.size = size
        this.modes.preview.size = size
        this.type = "Cube"
        this.svg = ctx.makeRectangle(cent.x,cent.y,size,size)
        this.svg.linewidth = 0
        this.svg.stroke = "cyan"
        this._mode = mode
        this._ctx = ctx
    }
    get elem(){
        this._ctx.update()
        this._elem = this.svg._renderer.elem
        return this._elem
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
        this.modes.normal.color = color
        this.svg.fill = color
    }
    get fill(){
        return this.svg.fill
    }
    set mode(mode){
        this._mode = mode
        this.svg.linewidth = this.mode.strokeWidth
        this.svg.width = this.mode.size
        this.svg.height = this.mode.size
        switch(this._mode){
            case "normal":
                this.fill = this.mode.color
                this.stroke = this.mode.color
                break
            case "preview":
                this.stroke = this.mode.color
                break
            default:
                this.mode = "normal"
                break
        }
    }
    get mode(){
        return this.modes[this._mode]
    }
    set stroke(color){
        this.modes.preview.color = color
        this.svg.stroke = color
    }
    get stroke(){
        return this.svg.stroke
    }
}

export {Cube as default}