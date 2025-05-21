


function log(...args){
      // This creates a native-looking log with a fake call stack
      const group = new Error().stack.split('\n')[2]; // e.g., "at myFunc (file.js:10:5)"
      console.log(...args);
      console.debug("asdsd")
}



class Vec2{
    constructor(x,y){this.x = x;this.y = y;}
    static Defined(x,y){return new Vec2(x,y);}
    static undefined(){return new Vec2(undefined,undefined);}
    static Zero(){return new Vec2(0,0);}
    static One(){return new Vec2(1,1);}
    static Up(){return new Vec2(0,1);}
    static Down(){return new Vec2(0,-1);}
    static Left(){return new Vec2(-1,0);}
    static Right(){return new Vec2(1,0);}

    magnitude(){return Math.sqrt(this.x*this.x + this.y*this.y);}
    normalize(){
        const mag = this.magnitude();
        if(mag == 0){
            this.x = 0;
            this.y = 0;
        }else{
            this.x = this.x/mag;
            this.y = this.y/mag;
        }
        return this
    }
    add_vec2(vec2){
        this.x += vec2.x;
        this.y += vec2.y;
        return this
    }
    sub_vec2(vec2){
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this
    }
    mult_scaler(value){
        this.x *= value
        this.y *= value
        return this
    }
    isEqual_vec2(vec2){
        return this.x === vec2.x && this.y === vec2.y
    }
    clampX(min, max){
        if(this.x < min){ this.x = min }
        else if(this.x > max){ this.x = max}
    }
    clampY(min, max){
        if(this.y < min){ this.y = min } 
        else if(this.y > max){ this.y = max}
    }
    clone(){
        return Vec2.Defined(this.x, this.y)
    }    

}


