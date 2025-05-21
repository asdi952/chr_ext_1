// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

function dev_reload(){
    console.log("browserAPI", browserAPI)
    browserAPI.runtime.sendMessage({
        msg: "reload"
    }).then(response => {
        console.log("Received response from background:", response);
    }).catch(error => {
        console.error("Error sending message to background:", error);
    });
}

function bg_send_smessage(type, data, callback){
    return browserAPI.runtime.sendMessage({type, data})
}

const bg = {
    async log(...msg){
        bg_send_smessage("log", [...msg], )
    },
    async dev_reload(){
        bg_send_smessage("dev_reload", undefined)
    },
    async save_state(state){
        bg_send_smessage("save_state", state)
    },
    async load_state(){
        const resp = await bg_send_smessage("load_state", undefined)
        console.log("load state res", resp)
        return resp
    }
}
