
class Cursor{
    constructor(x=0,y=0,size=10,cube){
        this._x = x
        this._y = y
        this._size = size
        this.moving = false
        this.pressed = false
        this.cube = cube
    }
    get x() {
        return Number(this._x)
    }
    get y() {
        return Number(this._y)
    }
    get size() {
        return Number(this._size)
    }
    set x(value) {
        this._x = value
    }
    set y(value) {
        this._y = value
    }
    set size(value) {
        this._size = value
    }
    checkPos(e){
            let x, y
            if (typeof arguments[1] === "undefined") {
                x = e.clientX - e.target.getBoundingClientRect().x
                y = e.clientY - e.target.getBoundingClientRect().y
            } else {
                x = e.clientX - arguments[1].getBoundingClientRect().x
                y = e.clientY - arguments[1].getBoundingClientRect().y
            }
            this.x = x
            this.y = y
            if(this.timer){
                clearTimeout(this.timer)
            }
            if(!this.moving){
                this.moving = true
            }
            this.timer = setTimeout(()=>{
                this.moving = false
            },100)
    }
}
export {Cursor as default}