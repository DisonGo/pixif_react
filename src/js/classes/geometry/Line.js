import { Point } from "./Point.js"

class Line {
    constructor(begining,ending){
        this.beg = begining
        this.end = ending
    }
    get distance(){
        return this.beg.distance(this.end)
    }
}
export {Line as default}