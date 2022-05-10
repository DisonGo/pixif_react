import { Editor } from 'js/classes/Editor';
import Size from 'js/preset/sizes';
import React, {Component} from 'react';
import { Route, Routes } from 'react-router-dom';
import './EditorPage.scss'
import penPic from '../../img/edit.png'
import eraserPic from '../../img/eraser.png'
import fillPic from '../../img/bucket.png'
import Cube from 'js/classes/geometry/Cube';
import { Point } from 'js/classes/geometry/Point';

export default class EditorPage extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path={"/"} element={<EditorSegment/>}></Route>
        </Routes>
      </div>
    );
  }
}


const ColorSet = { // Набор цветов
  black: "#000000",
  red: "#ff0000",
  orange: "#ff7b00",
  yellow: "#fff200",
  lightGreen: "#b2ff00",
  toxicGreen: "#32ff00",
  blueGreen: "#00ff6a",
  lightBlue: "#00ffb2",
  blue: "#00faff",
  darkBlue: "#000cff",
  purple: "#6600ff",
  lightPurple: "#d000ff",
  lightPink: "#ff00e5",
  pink: "#ff009d"
}

let editor = {}
class EditorSegment extends Component{
  constructor(props){
    super(props)
    this.state={
      showPreset:true,
      editorReady:false
    }
  }
  midleSize = 500
  segSizes = {
    left:   (Size.w-this.midleSize)/2,
    midle:  this.midleSize,
    right:  (Size.w-this.midleSize)/2,
  }
  startEditor=(size=20)=>{
    document.body.style.overflow = "hidden"
    this.setState({
      showPreset:false,
    })
    editor = new Editor(size)
    this.setState({
      editorReady:true
    })
  }
  render(){
    return(
      <div id='editorPage'style={{height:Size.h}}>
        <EditorPresetter show={this.state.showPreset} start={this.startEditor} size={this.segSizes.midle}></EditorPresetter>
        <div className="editor-segment" style={{width:this.segSizes.left}} id="left-panel">
          <svg viewBox="0 0 400 50" className='header'>
            <text y="45">Tools</text>
          </svg>
          <ToolPanel editorReady={this.state.editorReady}></ToolPanel>
        </div>
        <div className="editor-segment" style={{width:this.segSizes.midle}} id="editor">
          <svg viewBox="0 0 400 50" className='header'>
            <text y="45">Editor</text>
          </svg>
          <ColorPanel editorReady={this.state.editorReady}></ColorPanel>
        </div>
        <div className="editor-segment" style={{width:this.segSizes.right}} id="right-panel">
          <svg viewBox="0 0 400 50" className='header'>
            <text y="43">Settings</text>
          </svg>
        </div>
      </div>
    )
  }
  
}
const EditorPresetter = (props) =>{
  const sizePresets = [10,20,50]
  let presets = []
  sizePresets.forEach(size=>{
    presets.push(<button key={size} onClick={()=>{props.start(size)}}>{size}px</button>)
  })
  //width:props.size,height:props.size,
  return(
    <div className='editor-presetter container' style={{display:props.show?"":"none"}}>
      <h2>Choose pixels size:</h2>
      <div className="buttons">{presets}</div>
    </div>
  )
}
class ToolPanel extends Component{
  constructor(props){
    super(props)
    this.state = {
      curTool:this.ToolSet.pen,
      states:{}
    }
  }
  Setting = (type,name,baseValue,details)=>{
    const states = this.state.states
    states[name] = {
      name:name,
      value:baseValue,
      setValue:(value)=>{
        states[name].value = value
        this.setState({states})
      }
    }
    return({
      type: type,
      name: name,
      state: states[name],
      details:details
    })
  }
  penOnClick         = (data)=> {
    if(!this.props.editorReady)return
    if(!(data.cube instanceof Cube))return

    let brush = this.ToolSet.pen.settings.getSetting("brushSize")
    let size = Math.floor(brush.state.value/2),
    pX = data.arrayPos.x,
        pY = data.arrayPos.y
    for(let y = pY - size;y<=pY+size;y++){
      for(let x = pX - size;x<=pX+size;x++){
        if(editor.inRangeOfArray(data.array,x,y)){
          data.array[y][x].fill = data.tool.color
        }
      }
    }
    
  }
  eraserOnClick      = (data)=> {
    if(!this.props.editorReady)return
    if(!(data.cube instanceof Cube))return

    data.tool.color = "white"
    let brush = this.ToolSet.eraser.settings.getSetting("eraserSize")
    let size = Math.floor(brush.state.value/2),
    pX = data.arrayPos.x,
    pY = data.arrayPos.y
    for(let y = pY - size;y<=pY+size;y++){
      for(let x = pX - size;x<=pX+size;x++){
        if(editor.inRangeOfArray(data.array,x,y)){
          data.array[y][x].fill = data.tool.color
        }
      }
    }
  }
  fillOnClick        = (data)=> {
    let baseColor = data.cube.fill
    let hardness = Number(this.ToolSet.fill.settings.getSetting("hardness").state.value)
    function getPoly(x,y){
      let poly = []
      function squareCheck(x,y,offset){
        let squarePoly = []
        for(  let y1 = y - offset;y1<=y+offset;y1++){
          for(let x1 = x - offset;x1<=x+offset;x1++){
            if(editor.inRangeOfArray(data.array,x1,y1)){
              squarePoly.push({cube:data.array[y1][x1],p:new Point(x1,y1)})
            }
          }
        }
        return squarePoly
      }
      function getFourConnectedPoly(x,y,offset=1){
        let fourPoly = []
        if(editor.inRangeOfArray(data.array,x-offset,y))fourPoly.push({cube:data.array[y][x-offset],p: new Point(x-offset,y)})
        if(editor.inRangeOfArray(data.array,x,y-offset))fourPoly.push({cube:data.array[y-offset][x],p: new Point(x,y-offset)})
        if(editor.inRangeOfArray(data.array,x+offset,y))fourPoly.push({cube:data.array[y][x+offset],p: new Point(x+offset,y)})
        if(editor.inRangeOfArray(data.array,x,y+offset))fourPoly.push({cube:data.array[y+offset][x],p: new Point(x,y+offset)})
        return fourPoly
      }
      if(hardness%2===0){
        poly = squareCheck(x,y,hardness/2)
      }else{
        let polyEdge = getFourConnectedPoly(x,y,Math.round(hardness/2))
        let polyBody = squareCheck(x,y,Math.floor(hardness/2))
        poly = poly.concat(polyBody,polyEdge)
      }
      return poly
    }
    function fill(cube,startingPoint){
      cube.fill = data.tool.color
      let x = startingPoint.x,
      y = startingPoint.y, 
      poly = getPoly(x,y)
      for (const side of poly) {
        if(side.cube.fill === baseColor)fill(side.cube,side.p)
      }
    }
    if(baseColor===data.tool.color)return
    fill(data.cube,data.arrayPos)
  }
  strokeOnMouseOver  = (data)=> {
    if(!this.props.editorReady)return
    if(!data.tool.preview)return
    let baseColor = data.cube.fill
    data.array.forEach(row=>row.forEach(cube=>cube.mode="normal"))
    let hardness = Number(this.ToolSet.fill.settings.getSetting("hardness").state.value)
    function getPoly(x,y){
      let poly = []
      function squareCheck(x,y,offset){
        let squarePoly = []
        for(  let y1 = y - offset;y1<=y+offset;y1++){
          for(let x1 = x - offset;x1<=x+offset;x1++){
            if(editor.inRangeOfArray(data.array,x1,y1)){
              squarePoly.push({cube:data.array[y1][x1],p:new Point(x1,y1)})
            }
          }
        }
        return squarePoly
      }
      function getFourConnectedPoly(x,y,offset=1){
        let fourPoly = []
        if(editor.inRangeOfArray(data.array,x-offset,y))fourPoly.push({cube:data.array[y][x-offset],p: new Point(x-offset,y)})
        if(editor.inRangeOfArray(data.array,x,y-offset))fourPoly.push({cube:data.array[y-offset][x],p: new Point(x,y-offset)})
        if(editor.inRangeOfArray(data.array,x+offset,y))fourPoly.push({cube:data.array[y][x+offset],p: new Point(x+offset,y)})
        if(editor.inRangeOfArray(data.array,x,y+offset))fourPoly.push({cube:data.array[y+offset][x],p: new Point(x,y+offset)})
        return fourPoly
      }
      if(hardness%2===0){
        poly = squareCheck(x,y,hardness/2)
      }else{
        let polyEdge = getFourConnectedPoly(x,y,Math.round(hardness/2))
        let polyBody = squareCheck(x,y,Math.floor(hardness/2))
        poly = poly.concat(polyBody,polyEdge)
      }
      return poly
    }
    function stroke(cube,startingPoint){
      cube.stroke = data.tool.color
      cube.mode = "preview"
      let x = startingPoint.x,
          y = startingPoint.y, 
          poly = getPoly(x,y)
      for (const side of poly) {
        if(side.cube.fill === baseColor && side.cube.stroke !== cube.stroke)stroke(side.cube,side.p)
      }
    }
    if(baseColor!==data.tool.color)stroke(data.cube,data.arrayPos)
  }
  unstrokeOnMouseOut = (data)=>{
    data.array.forEach((arr)=>{
      arr.forEach((cube)=>{
        cube.mode = "normal"
      })
    })
  }
  ToolSet = {
    pen:{
      name:"pen",
      image: penPic,
      events:{
        onClick:this.penOnClick,
        onSwitch:()=>{
          editor.cursor.cube.stroke = editor.curTool.color
          this.unstrokeOnMouseOut({array:editor.cubes})
        }
      },
      color:ColorSet.black,
      settings:{
        brushSize:{type:"range",name:"brushSize",baseValue:1,details:{min:1,max:5,step:2}}
      },
      key:"p"
    },
    fill:{
      name:"fill",
      image: fillPic,
      events:{
        onClick:this.fillOnClick,
        onMouseOver:this.strokeOnMouseOver,
        onMouseOut:this.unstrokeOnMouseOut,
        onSwitch:()=>{editor.cursor.cube.stroke = editor.curTool.color}
      },
      color:ColorSet.black,
      settings:{
        hardness:{type:"range",name:"hardness",baseValue:1,details:{min:1,max:10,step:1}}
      },
      key:"f"
    },
    eraser:{
      name:"eraser",
      image: eraserPic,
      events:{
        onClick:this.eraserOnClick,
        onSwitch:()=>{
          editor.cursor.cube.stroke = "white"
          this.unstrokeOnMouseOut({array:editor.cubes})
        }
      },
      color:"white",
      settings:{
        eraserSize:{type:"range",name:"eraserSize",baseValue:1,details:{min:1,max:5,step:2}}
      },
      key:"e"
    }
  }
  generateTools = () =>{
    for (const key in this.ToolSet) {
      const tool = this.ToolSet[key]
      editor.AddTool(tool.name,tool.events,tool.color)
      let settings = []
      for(const key in tool.settings){
        const set = tool.settings[key]
        settings.push(this.Setting(set.type,set.name,set.baseValue,set.details))
      }
      tool.settings = settings
      tool.settings.getSetting = (name)=>tool.settings.find(a=>a.name===name);
      tool.key = `Key${tool.key.toUpperCase()}`
      window.addEventListener("keypress",(e)=>{
        if(e.code === tool.key)this.setTool(tool)
      })
    }
    this.setTool(this.ToolSet.pen)
  }
  
  componentDidUpdate(prevP){
    if(this.props.editorReady === prevP.editorReady) return;
    if(!this.props.editorReady)return;
    if(editor.tools.length>1)return;
    this.generateTools()
    this.setState({curTool:this.state.curTool})
  }
  setTool = (tool) =>{
    if(!this.props.editorReady)return;
    this.setState({
      curTool:tool
    })
    editor.SetTool(tool.name) 
  }
  render(){
    //Generating tool settings
    const toolSettings = {}
    const tools = []
    for (const key in this.ToolSet) {
      const tool = this.ToolSet[key];
      tools.push(<Tool tool={tool} key={tool.name}  ClickHandeler={this.setTool}></Tool>)

      if(!Array.isArray(tool.settings)) return;
      const setArr = []
      tool.settings.forEach(setting => {
        setArr.push(
          <div key={setting.name}>
            <label>{setting.name}:{this.state.states[setting.name].value}</label>
            <ToolSetting setting={setting}></ToolSetting>
          </div>
        )
      });
      toolSettings[key] = setArr
      
    }
    const renderArr = toolSettings[this.state.curTool.name]
    //Generating tools
    

    return(
      <div className='container' id='toolPanel'>
        <div style={{flexGrow:0}} className="container" id='tools'>
          {tools}
        </div>
        <div style={{flexGrow:1}}>
          {renderArr}
        </div>
      </div>
    )  
  }
}
const Tool = (props)=>{
  return(
    <div  className="tool" 
          style={{backgroundImage:`url(${props.tool.image})`}}
          onClick={()=>{props.ClickHandeler(props.tool)}}></div>
  )
}
const ToolSetting = (props)=>{
  const s = props.setting
  switch (s.type) {
    case "range":
      const handleChange = e => {
        s.state.setValue(e.target.value)
      }
      return(
        <div className        ="ToolSetting">
          <input  name        ={s.name} 
                  type        ="range" 
                  min         ={s.details.min} 
                  max         ={s.details.max} 
                  onChange    ={handleChange} 
                  defaultValue={s.state.value} 
                  step        ={s.details.step}/>
        </div>
      )      
    default:
      return(
        <div className="ToolSetting"></div>
      );
  }
}
class ColorPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedColor:ColorSet.black
    }
    
  }
  changeColor = (color)=>{
    if(!this.props.editorReady)return
    this.setState({
      selectedColor:color
    })
    editor.curTool.color = color
    if(editor.curTool.name!=="eraser")editor.cursor.cube.stroke = color
    editor.GetTool("pen").color = color
    editor.GetTool("fill").color = color
    editor.cubes.forEach(row=>row.forEach(cube=>cube.stroke = color))
  }
  render() { 
    if(!this.props.editorReady)return;
    this.colors = []
    for(const color in ColorSet){
      let c = ColorSet[color]
      this.colors.push( 
       <div key={color} className="colorBtnsContainer container" style={{position:'relative'}}>
                  <Color checked={this.state.selectedColor===c} color ={c} ClickHandeler={this.changeColor}></Color>
                </div>)
    }
    return(
      <form className='container' id='colorPanel'>
          {this.colors}
      </form>
    )
  }
}
 
class Color extends Component {
  render() { 
    const checked = this.props.checked
    return(
      <div className='container'  onClick={()=>{this.props.ClickHandeler(this.props.color)}}>
        <div   className={`color ${checked?"selected":""}`}
                style={{backgroundColor:this.props.color}}
                data-checked={checked}></div>
      </div>
    )
  }
}


// function getRandom(min, max) {
//   return Math.random() * (max - min) + min;
// }
// function getRandPointInRange(min,max){
//   let x = Math.round(getRandom(min,max))
//   let y = Math.round(getRandom(min,max))
//   return new Point(x, y)
// } 