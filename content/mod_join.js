




function isKkeyDown(keyname){
    const keystate = getKkeyState(keyname)
    return keystate.down
}

document.addEventListener("keydown", (event)=>{
    callOnKkeySeq(event.code, ["AltLeft", "KeyR"], ()=>{bg.dev_reload()})
})



document.addEventListener('keydown', (event) => {
    const isrepeat = registerKkeyDown(event.code);

    scroll.keydown_all_time(event)

    if(isrepeat == 1){return}

    vpointer.proc_kkey_down(event)
    scroll.keydown(event)

    // callOnKkeySeq(event.code, ["AltLeft", "KeyR"], ()=>{bg.dev_reload()})
});

document.addEventListener('keyup', (event) => {
    const isrepeat = registerKkeyUp(event.code);

    if(isrepeat == 1){return}

    vpointer.proc_kkey_up(event)
    scroll.keyup(event)

});

