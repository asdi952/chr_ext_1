// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
console.log(browserAPI)

function dev_reload_ext_tabs(){
    browserAPI.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          if (tab.id) browserAPI.tabs.reload(tab.id);
        }
        // Reload extension after tab reloads triggered
        browserAPI.runtime.reload();
    });
}
// const bg = {
//     async log(...msg){
//         bg_send_smessage("log", [...msg], )
//     },
//     async dev_reload(){
//         bg_send_smessage("dev_reload", undefined)
//     },
//     async save_state(state){
//         bg_send_smessage("save_state", state)
//     },
//     async load_state(){
//         const resp = await bg_send_smessage("load_state", state)
//         console.log(resp)
//     }
// }
const tabState = {}

function createDefaultTabState(id){
    return {
        id,
        data:undefined
    }
}

function getTabState(id){
    const state = tabState[id]
    if(state == undefined){
        return null
    }
    return state
}
function setTabState(id, data){
    let state = tabState[id]
    if(state == undefined){
        state = createDefaultTabState(id, data)
        tabState[id] = state
    }
    state.data = data
}


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // Handle the message here
//     console.log("Message received:", request);
  
//     // Send a response back if needed
//     sendResponse({ status: "Message received successfully" });
//   });

// Listen for messages from content script
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    switch(message.type){
        case "load_state":
            const state = getTabState(sender.tab.id)
            console.log("load state sending", state)
            sendResponse(state)
            return true
        case "save_state":
            setTabState(sender.tab.id, message.data)
            return false
        case "dev_reload":
            dev_reload_ext_tabs()
            return false
        case "log":
            console.log(...message.data)
            return false
    }

});

