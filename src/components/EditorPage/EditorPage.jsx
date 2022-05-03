import { Editor } from 'js/classes/Editor';
import { Point } from 'js/classes/geometry/Point';
import Size from 'js/preset/sizes';
import React, {Component, forwardRef} from 'react';
import { Route, Routes } from 'react-router-dom';
import './EditorPage.scss'
import penPic from '../../img/edit.png'
import eraserPic from '../../img/eraser.png'
import Cube from 'js/classes/geometry/Cube';

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
      curTool:"pen"
    }
    
  }
  penAction=(data)=>{
    if(editorReady()){
      if(data.cube instanceof Cube){
        data.cube.fill = data.tool.color
      }
    }
  }
  eraserAction = (data)=>{
    if(editorReady()){
      data.tool.color = "white"
      if(data.cube instanceof Cube){
        data.cube.fill = data.tool.color
      }
    }
  }
  ToolSet = {
    pen:{
      name:"pen",
      image: penPic,
      action:this.penAction,
      color:ColorSet.black
    },
    eraser:{
      name:"eraser",
      image: eraserPic,
      action:this.eraserAction,
      color:"white"
    }
  }
  componentDidMount(){
    if(editorReady()){
      for (const key in this.ToolSet) {
        const tool = this.ToolSet[key]
        editor.AddTool(tool.name,tool.action,null,tool.color)
      }
      this.setTool(this.ToolSet.pen)
    }
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
    return(
      <div className='container' id='toolPanel'>
        <div style={{flexGrow:0}} className="container" id='tools'>
          <Tool tool={this.ToolSet.pen}   ClickHandeler={this.setTool}></Tool>
          <Tool tool={this.ToolSet.eraser}ClickHandeler={this.setTool} ></Tool>
        </div>
        <div style={{flexGrow:1}}>2</div>
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
      editor.GetTool("pen").color = color
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
  constructor(props) {
    super(props);
  }
  render() { 
    const checked = this.props.checked
    return(
      <span   className={`color ${checked?"selected":""}`}
                          style={{backgroundColor:this.props.color}}
                          data-checked={checked}
                          onClick={()=>{this.props.ClickHandeler(this.props.color)}}></span>
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