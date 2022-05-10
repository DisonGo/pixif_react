import Two from "two.js"

export class Point {
    constructor(x, y) {
        this._x = x
        this._y = y
    }
    get x() {
        return Number(this._x)
    }
    get y() {
        return Number(this._y)
    }
    set x(value) {
        this._x = value
    }
    set y(value) {
        this._y = value
    }
    sumX(value) {
        this._x += value
    }
    sumY(value) {
        this._y += value
    }
    sumPoint(p) {
        this._x += p.x
        this._y += p.y
        return this
    }
    substrPoint(p) {
        this._x -= p.x
        this._y -= p.y
        return this
    }
    copy(p){
        this._x = p.x
        this._y = p.y
        return this
    }
    static clone(p){
        return new Point(p.x,p.y)
    }
    static PToTwoVector(p){
        return new Two.Vector(p.x,p.y)
    }
    static PointFromVector(v){
        return new Point(v.x,v.y)
    }
    static deltaVector(p1,p2){
        let dx = p2.x - p1.x
        let dy = p2.y - p1.y
        return new Point(dx,dy)
    }
    distance(p){
        let dx = this.x - p.x
        let dy = this.y - p.y
        return Math.hypot(dx,dy)
    }
    compare(p){
        return (this.x===p.x&&this.y===p.y)
    }
    log(){
        console.log(`X:${this._x} ; Y:${this._y}`);
    }
}