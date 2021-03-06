import Two from "two.js"
// import Size from "js/preset/sizes.js"
import Cursor from "./Cursor.js"
import Cube from "./geometry/Cube.js"
import { Point } from "./geometry/Point.js"
import { Tool } from "./Tool.js"
// const config = {
//     type: Two.Types.svg,
//     width: 400,
//     height: 400,
//     autostart: true
// }
const click = new Event("click")
const mouseover = new Event("mouseover")
let config = {
    type: Two.Types.svg,
    height: 600,
    width: 600,
    autostart: true
}
let cSize = 20

function createCanvas(ctx) {
    // let tag = document.createElement("div")
    // tag.id = "mainCan"
    // .appendChild(tag)
    let parent = document.getElementById("editor")
    let div = document.createElement("div")
    parent.appendChild(div)
    ctx.appendTo(div)
    let w = parent.offsetWidth + "px"
    let h = parent.offsetWidth + "px"
    div.style.width = w
    div.style.height = h
    ctx.renderer.domElement.style.width = w
    ctx.renderer.domElement.style.height = h
    ctx.width = parent.offsetWidth
    ctx.height = parent.offsetWidth
    return ctx.renderer.domElement
}

export class Editor {
    constructor(cubeSize = 20) {
        cSize = cubeSize
        
        // Two.js sample 
        this.viewport = new Two(config)

        // DOM canvas for Events
        this.canvas = createCanvas(this.viewport)
        this.canvas.id = "canvas"
        
        //Events
        this.SetEvent("mousedown",(e)=>{
            this.cursor.pressed = true
        })
        this.SetEvent("mouseup",(e)=>{this.cursor.pressed = false})
        this.SetEvent("mousemove",(e)=>{
            let cursorP = this.CalcCursorPos(e)
            this.cursor.cube.setCenter = cursorP
            if(this.cursor.pressed){
                let p = this.CalcArrayPos(e)
                if(this.inRangeOfArray(this.cubes,p.x,p.y)){
                    let cube = this.cubes[p.y][p.x] 
                    cube.elem.dispatchEvent(click)
                    cube.elem.dispatchEvent(mouseover)
                }
            }
        })

        // Layers
        this.bg = this.viewport.makeGroup()
        this.bg.id = "bg"
        this.topmost = this.viewport.makeGroup()
        this.topmost.id = "topmost"
        this.UI = this.viewport.makeGroup()
        this.UI.id = "UI"
        //Cursor
        let cent = new Point(cSize/2,cSize/2)
        let cursorCube = new Cube(cent,cSize,this.viewport)
        cursorCube.mode = "preview"
        cursorCube.svg.noFill()
        cursorCube.elem.style.pointerEvents = "none"
        // cursorCube.flicking = setInterval(()=>{
        //     if(!this.cursor.pressed){
        //         let s = cursorCube.stroke 
        //         s === "white"?cursorCube.stroke  = "black":cursorCube.stroke  = "white"
        //     }
        // },800)
        
        this.cursor = new Cursor(0,0,cSize,cursorCube)
        this.UI.add(this.cursor.cube.svg)
        cursorCube.elem.style.pointerEvents = "none";
        //Tools
        this.tools = []
        this.AddTool()
        this.curTool = this.tools[0]
        // Arrays of Game elements
        this.objects = []
        this.CreateCubeNet()

    }
    inRangeOfArray(arr,x, y) {
        return (x < arr[0].length && x >= 0 && y < arr.length && y >= 0)
    }
    CalcCursorPos(e){
        let dx = e.clientX - this.canvas.getBoundingClientRect().x
        let dy = e.clientY - this.canvas.getBoundingClientRect().y
        let x = dx - dx % cSize + cSize/2
        let y = dy - dy % cSize + cSize/2
        return new Point(x,y)
    }
    CalcArrayPos(e){
        let dx = e.clientX - this.canvas.getBoundingClientRect().x
        let dy = e.clientY - this.canvas.getBoundingClientRect().y
        let x = dx - dx % cSize
        let y = dy - dy % cSize
        return new Point(x/cSize,y/cSize)
    }
    CreateCubeNet(){
        let start = new Date()
        let Size = {
            w:this.viewport.width,
            h:this.viewport.height
        } 
        let cubes = [];
        let newCubesRow = [];
        let w = ((Size.w - Size.w % cSize) / cSize)
        
        for (let i = 0; i < w; i++) {
            newCubesRow = [];
            cubes.push(newCubesRow);
            for (let j = 0; j < w; j++) {
                let center = new Point(j*cSize + cSize/2,i*cSize + cSize/2)
                let cube = this.AddCube(center,cSize);
                cube.svg.fill = "white"
                newCubesRow.push(cube)
            }
        }
        this.cubes = cubes
        this.viewport.update()
        // Most of event rendering script
        let details = {}
        this.cubes.forEach((cubes,y)=>{
            cubes.forEach((cube,x)=>{
                cube.elem.addEventListener("click",(e)=>{
                    if(!(this.curTool.onClick instanceof Function)) return;
                    details = {
                        cube:cube,
                        array:this.cubes,
                        arrayPos:new Point(x,y),                                                                                                   
                        tool:this.curTool
                    }
                    this.curTool.onClick(details)
                })
                cube.elem.addEventListener("mouseover",(e)=>{
                    if(!(this.curTool.onMouseOver instanceof Function)) return;
                    details = {
                        cube:cube,
                        array:this.cubes,
                        arrayPos:new Point(x,y),                                                                                                   
                        tool:this.curTool
                    }
                    this.curTool.onMouseOver(details)
                })
            })
        })
        this.canvas.addEventListener("mouseout",(e)=>{
            let p = this.CalcArrayPos(e)
            if(e.target !== this.canvas) return;
            if(this.inRangeOfArray(this.cubes,p.x,p.y)) return;
            if(this.curTool.name !== "fill") return;
            if(!(this.curTool.onMouseOut instanceof Function)) return;
            details = {
                array:this.cubes,
                tool:this.curTool
            }
            this.curTool.onMouseOut(details)
        },true)
        let end =  new Date()
        console.log(`Editor build time:\t${end.getTime()-start.getTime()}ms`);        
    }
    SetEvent(eventName, func) {
        window.addEventListener(eventName, func)
    }
    AddCube(center,size){
        let cube = new Cube(center,size, this.viewport)
        cube.svg.fill = "white"
        this.bg.add(cube.svg)
        this.objects.push(cube)
        
        return cube
    }
    AddTool(name = "Default",events,color){
        console.log(`Adding ${name}`);
        this.tools.push(new Tool(name,events,color))
    }
    SetTool(name){
        let tool = this.tools.find((tool)=>tool.name===name)
        if(typeof tool === 'undefined'){
            this.curTool=this.tools[0]
        }
        else{
            this.curTool = tool
            this.curTool.onSwitch()
            console.log(`Current tool: ${this.curTool.name}`);
        }
    }
    GetTool(name){
        return this.tools.find((tool)=>tool.name===name) || this.tools[0]
    }
    SetTick(obj, func) {
        obj.tick = func
        this.viewport.bind("update", obj.tick)
    }
}