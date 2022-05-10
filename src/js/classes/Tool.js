export class Tool{
    constructor(
        name    = "Default",
        events  = {onClick:()=>{console.log("Default tool did that")}},
        color   = "white")
    {
        this.name = name
        this.events = events
        for (const key in this.events) {
            const event = this.events[key];
            this[key] = (data = {})=>{
                event(data)
            }
        }
        this.color = color
        this.preview = true
    }
    setColor(color){
        this.color = color
    }
}
