
// Send message to background script when page loads


class Vpointer{
    static initDefaultState(){
        return {
            enable:false,
    
            position:Vec2.Defined(window.screen.width/2, window.screen.height/2),
            velocity:730,
            sprint_mult: 2.5,
            slow_mult: 0.2,

            jump_dist:320,

            process_interval:undefined,
            process_interval_period:20,
            
        }
    }

    static serializeState(state){
        const sstate = {
            position: state.position,
            enable: state.enable,
        }
        return sstate
    }
    static deserializeState(sstate){
        const state = Vpointer.initDefaultState()
        state.position = Vec2.Defined(sstate.position.x, sstate.position.y)
        state.enable = sstate.enable
        return state
    }
    
    constructor(){
        this.state = undefined
        this.resources = {
            pointer: null
        }
        this.localStg_name = "vpointer"

        this.inputAxisX = new KkeyAxis()
        this.inputAxisY = new KkeyAxis()
    }

    async init(){
        // let state_str = sessionStorage.getItem(this.localStg_name)
        let state = await bg.load_state()

        if(state == null){
            this.state = Vpointer.initDefaultState()
        }else{
            this.state = Vpointer.deserializeState(state.data)
        }
        this.resources.pointer = this.createPointerResource()
        console.log("init this.state.enable", this.state.enable)
        this.enablePointer(this.state.enable)
    }
    async deinit(){
        await bg.save_state(Vpointer.serializeState(this.state))
    }

    createPointerResource(){
        const virtMouse = document.createElement("div");
        virtMouse.id = "virtual-circle-pointer";
      
        // Style it as a red circle
        Object.assign(virtMouse.style, {
          position: "fixed",
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          borderRadius: "50%",
          pointerEvents: "none", // Let clicks pass through
          zIndex: "9999",
          top: `${this.state.position.y}px`,
          left: `${this.state.position.x}px`,
          transform: "translate(-50%, -50%)",
          display: "none",
        });
      
        // Add to the page
        document.body.appendChild(virtMouse);
        return virtMouse
    }

    movePointer( direction){
        this.state.position.add_vec2(direction)
        this.state.position.clampX(0, window.screen.availWidth)
        this.state.position.clampY(0, window.screen.availHeight)

        this.resources.pointer.style.left  = `${this.state.position.x}px`
        this.resources.pointer.style.top = `${this.state.position.y}px`
    }
    enablePointer(enableBit){
        this.state.enable = enableBit
        if(enableBit == true){
            this.resources.pointer.style.display = "block"

            this.state.process_interval = setInterval(()=>{this.process(this.state.process_interval_period)}, this.state.process_interval_period) 
        }else{
            this.resources.pointer.style.display = "none"
            
            clearInterval(this.state.process_interval)
            this.state.process_interval = undefined
        }
    }

    togglePointer(){
        this.enablePointer(!this.state.enable)
    }

    proc_kkey_down(kevent){
        callOnKkeySeq( kevent.code, ["AltLeft", "KeyM"], ()=>{vpointer.togglePointer()})
        log("kevent", kevent)
        if(this.state.enable == false){ return}

        callOnKkeySeq( kevent.code, ["KeyU"], ()=>{vpointer.pointerClick()})
        callOnKkeySeq( kevent.code, ["KeyY"], ()=>{vpointer.backwardPage()})
        callOnKkeySeq( kevent.code, ["KeyO"], ()=>{vpointer.forwardPage()})
        callOnKkeySeq( kevent.code, ["KeyG"], ()=>{vpointer.escapeKey()})
     
        
        doubleClick(kevent, "KeyH", ()=>{ this.movePointer(Vec2.Defined(-this.state.jump_dist, 0))})
        doubleClick(kevent, "KeyL", ()=>{ this.movePointer(Vec2.Defined(this.state.jump_dist, 0))})
        doubleClick(kevent, "KeyJ", ()=>{ this.movePointer(Vec2.Defined(0, -this.state.jump_dist))})
        doubleClick(kevent, "KeyK", ()=>{ this.movePointer(Vec2.Defined(0, this.state.jump_dist))})

        this.inputAxisX.check_keyDown(kevent.code, "KeyL", "KeyH")
        this.inputAxisY.check_keyDown(kevent.code, "KeyK", "KeyJ")
    }

    proc_kkey_up(kevent){
        this.inputAxisX.check_keyUp(kevent.code, "KeyL", "KeyH")
        this.inputAxisY.check_keyUp(kevent.code, "KeyK", "KeyJ")
    }

    process(deltatime){
        if(this.state.enable == false){return}
        if(this.inputAxisX.value == 0 &&  this.inputAxisY.value == 0){ return}
        
        let dist = this.state.velocity * deltatime / 1000
        if(isKkeyDown("ShiftLeft")){
            dist *= this.state.sprint_mult
        }else 
        if(isKkeyDown("ControlLeft")){
            dist *= this.state.slow_mult
        }
        
        const kkdir = Vec2.Defined(this.inputAxisX.value, this.inputAxisY.value) 
        const dir = kkdir.normalize().mult_scaler(dist)

        this.movePointer(dir)
    }

    pointerClick(){
        const target = document.elementFromPoint(this.state.position.x, this.state.position.y);
        if (!target) return;
    
        ["mousedown", "mouseup", "click"].forEach(type => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: this.state.position.x,
                clientY: this.state.position.y,
                button: 0, // Left button
                buttons: 1 // Indicates the primary button is pressed
            });
            target.dispatchEvent(event);
        });
    }
    backwardPage(){
        log("backward page")
        history.back()
    }
    forwardPage(){
        log("forward page")
        history.forward()
    }
    escapeKey(){
        const escEvent = new KeyboardEvent("keydown", {
            key: "Escape",
            code: "Escape",
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEvent);
    }
}

const vpointer = new Vpointer()
vpointer.init()

window.addEventListener("beforeunload", () => {
    vpointer.deinit()
});




