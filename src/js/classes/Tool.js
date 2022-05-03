export class Tool{
    constructor(name="Default",action=()=>{console.log("Default tool did that");},onSwitch=()=>{},color = "white"){
        this.name = name
        this.actionFunc = action
        this.onSwitchFunc = onSwitch
        this.color = color
    }
    action(data={}){
        this.actionFunc(data)
    }
    onSwitch(data={}){
        this.onSwitchFunc(data)
    }
    setColor(color){
        this.color = color
    }
}
