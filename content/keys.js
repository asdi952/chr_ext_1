

function createKeyState( down, down_seqcount, up_seqcount){
    return {down, down_seqcount, up_seqcount}
}
function createDefaultKeyState(){
    return createKeyState(0,0,0);
}
function createCaptureKkey(keyname){
    return {
        name: keyname,
        time: performance.now(),
    }
}
const kkeys = {
    keysState:{
        "default": createDefaultKeyState(),
    },
    down_seqcount:0,
    up_seqcount:0,

    cap_down_kkey: createCaptureKkey(""),
    lcap_down_kkey:createCaptureKkey(""),

    settings:{
        double_click_period: 200
    }

}
function resetKkeysState(){
    for(let state in Object.values(kkeys.keysState)){
        state.down = 0
    }
}
// console.log(kkeys.keysState.values())
resetKkeysState()

function getKkeyState(keyname){
    let keystate = kkeys.keysState[keyname]
    if(keystate == undefined){
        keystate = createDefaultKeyState();
        kkeys.keysState[keyname] = keystate;
    }
    return keystate;
}


function registerKkeyDown(keyname){
    const keystate = getKkeyState(keyname);
    if(keystate.down == 1){ return 1}

    keystate.down = 1;
    keystate.down_seqcount = kkeys.down_seqcount;
    kkeys.down_seqcount++;

    kkeys.lcap_down_kkey = kkeys.cap_down_kkey
    kkeys.cap_down_kkey = createCaptureKkey(keyname)

    return 0
}

function registerKkeyUp(keyname){
    const keystate = getKkeyState(keyname);
    if(keystate.down == 0){ return 1}

    keystate.down = 0;
    keystate.up_seqcount = kkeys.up_seqcount;
    kkeys.up_seqcount++;
    return 0
}

function callOnKkeySeq(curkeycode, keyseq, callback){
    if(curkeycode === keyseq[keyseq.length -1]){
        let lkeystate = getKkeyState(keyseq[0])
        if(lkeystate.down == 0){return}

        for(let i = 1; i < keyseq.length - 1; i++){
            const keystate = getKkeyState(keyseq[i])
            if(keystate.down == 0){return}
            if(lkeystate.down_seqcount >= keystate.down_seqcount){return}
        }
        callback()
    }
}

function doubleClick(kevent, keyname, callback){
    if(keyname != kevent.code){ return 1}
    if(kkeys.cap_down_kkey.name === kkeys.lcap_down_kkey.name 
        && kkeys.cap_down_kkey.time - kkeys.lcap_down_kkey.time < kkeys.settings.double_click_period){
            log("double click")
        callback()
        return 0
    }
    return 1
}

class KkeyAxis{
    constructor(){
        this.pressedCount = 0
        this.value = 0
    }   

    check_keyDown(keyname, positive_name, negative_name){
        if(keyname === positive_name){
            this.pressedCount ++
            this.value = 1
        }else
        if(keyname === negative_name){
            this.pressedCount ++
            this.value = -1
        }
        return this.value
    }
    check_keyUp(keyname, positive_name, negative_name){
        if(keyname === positive_name){
            this.pressedCount --;
            if(this.pressedCount === 0){
                this.value = 0
            }else{
                this.value = -1
            }
        }else 
        if(keyname === negative_name){
            this.pressedCount --;
            if(this.pressedCount === 0){
                this.value = 0
            }else{
                this.value = 1
            }
        }
        return this.value
    }

}


