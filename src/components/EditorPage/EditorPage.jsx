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
function editorReady (){
  return editor instanceof Editor
}
class EditorSegment extends Component{
  midleSize = 500
  segSizes = {
    left:   (Size.w-this.midleSize)/2,
    midle:  this.midleSize,
    right:  (Size.w-this.midleSize)/2,
  }
  componentDidMount(){
    // console.log("Loaded");
    if(!editorReady()){
      this.startEditor()
    }
  }
  startEditor(){
    document.body.style.overflow = "hidden"
    editor = new Editor(20)

  }
  render(){
    return(
      <div id='editorPage'style={{height:Size.h}}>
        <div className="editor-segment" style={{width:this.segSizes.left}} id="left-panel">
          <svg viewBox="0 0 400 50" className='header'>
            <text y="45">Tools</text>
          </svg>
          <ToolPanel></ToolPanel>
        </div>
        <div className="editor-segment" style={{width:this.segSizes.midle}} id="editor">
          <svg viewBox="0 0 400 50" className='header'>
            <text y="45">Editor</text>
          </svg>
          <ColorPanel></ColorPanel>
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
  penAction     = (data)=> {
    if(editorReady()){
      if(data.cube instanceof Cube){
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
    }
  }
  eraserAction  = (data)=> {
    if(editorReady()){
      data.tool.color = "white"
      if(data.cube instanceof Cube){
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
    }
  }
  fillAction    = (data)=> {
    let baseColor = data.cube.fill
    function getFourConnectedPoly(x,y){
      let poly = []
      if(editor.inRangeOfArray(data.array,x-1,y))poly.push({cube:data.array[y][x-1],p: new Point(x-1,y)})
      if(editor.inRangeOfArray(data.array,x,y-1))poly.push({cube:data.array[y-1][x],p: new Point(x,y-1)})
      if(editor.inRangeOfArray(data.array,x+1,y))poly.push({cube:data.array[y][x+1],p: new Point(x+1,y)})
      if(editor.inRangeOfArray(data.array,x,y+1))poly.push({cube:data.array[y+1][x],p: new Point(x,y+1)})
      return poly
    }
    function fill(cube,startingPoint){
      cube.fill = data.tool.color
      let x = startingPoint.x,
          y = startingPoint.y, 
          poly = getFourConnectedPoly(x,y)
      for (const side of poly) {
        if(side.cube.fill === baseColor)fill(side.cube,side.p)
      }
    }
    if(baseColor!==data.tool.color)fill(data.cube,data.arrayPos)
  }
  ToolSet = {
    pen:{
      name:"pen",
      image: penPic,
      action:this.penAction,
      onSwitch:()=>{editor.cursor.cube.stroke = editor.curTool.color},
      color:ColorSet.black,
      settings:{
        brushSize:{type:"range",name:"brushSize",baseValue:1,details:{min:1,max:5}}
      },
      key:"p"
    },
    fill:{
      name:"fill",
      image: fillPic,
      action:this.fillAction,
      onSwitch:()=>{editor.cursor.cube.stroke = editor.curTool.color},
      color:ColorSet.black,
      settings:{},
      key:"f"
    },
    eraser:{
      name:"eraser",
      image: eraserPic,
      action:this.eraserAction,
      onSwitch:()=>{editor.cursor.cube.stroke = "white"},
      color:"white",
      settings:{
        eraserSize:{type:"range",name:"eraserSize",baseValue:1,details:{min:1,max:5}}
      },
      key:"e"
    }
  }
  
  
  componentDidMount(){
    if(editorReady()){
      for (const key in this.ToolSet) {
        const tool = this.ToolSet[key]
        console.log(`Adding ${tool.name}`);
        editor.AddTool(tool.name,tool.action,tool.onSwitch,tool.color)
        let settings = []
        for(const key in tool.settings){
          const set = tool.settings[key]
          settings.push(this.Setting(set.type,set.name,set.baseValue,set.details))
        }
        tool.settings = settings
        tool.settings.getSetting = (name)=>{
          return tool.settings.find((a)=>a.name===name)
        }
        tool.key = `Key${tool.key.toUpperCase()}`
        window.addEventListener("keypress",(e)=>{
          if(e.code === tool.key)this.setTool(tool)
        })
      }
      this.setTool(this.ToolSet.pen)
    }
    this.setState({curTool:this.state.curTool})
  }
  setTool = (tool) =>{
    this.setState({
      curTool:tool
    })
    if(editorReady()){
      editor.SetTool(tool.name) 
    }
  }
  render(){
    //Generating tool settings
    const toolSettings = {}
    const tools = []
    for (const key in this.ToolSet) {
      const tool = this.ToolSet[key];
      tools.push(<Tool tool={tool} key={tool.name}  ClickHandeler={this.setTool}></Tool>)
      if(Array.isArray(tool.settings)){
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
function Tool(props){
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
        <div className="ToolSetting">
          <input name={s.name} type="range" min={s.details.min} max={s.details.max} onChange={handleChange} defaultValue={s.state.value} step="2"/>
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
    if(editorReady()){
      this.setState({
        selectedColor:color
      })
      editor.curTool.color = color
      if(editor.curTool.name!=="eraser")editor.cursor.cube.stroke = color
      editor.GetTool("pen").color = color
      editor.GetTool("fill").color = color
    }
  }
  
  render() { 
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