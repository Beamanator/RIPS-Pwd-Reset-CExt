// setup constants
const CONTENT_SCRIPT_PORT = 'CONTENT_SCRIPT_PORT';
const REACT_APP_PORT = 'REACT_APP_PORT';
const INIT_PORT = 'INIT_PORT'

const initContentScriptPort = (port) => {
    console.log('init content script port', port);
}

const initReactAppPort = (port) => {
    console.log('init react app port:', port);
}

// TODO: FIXME: onChange sets up long term connections!
chrome.runtime.onConnect.addListener(port => {
    console.assert(port.name == CONTENT_SCRIPT_PORT || port.name == REACT_APP_PORT);
    
    // send init message
    port.postMessage({ code: INIT_PORT });
    
    switch (port.name) {
        case CONTENT_SCRIPT_PORT:
            // init port
            initContentScriptPort( port );
            break;

        case REACT_APP_PORT:
            // init port
            initReactAppPort( port );
            break;
        
        default:
            console.error(
                "ERR: somehow connecting port isn't recognized, but we said assert!",
                port
            );
    }
});

// delete ports? I think this can only be called elsewhere?
// https://developer.chrome.com/extensions/messaging#port-lifetime
// chrome.runtime.Port.onDisconnect.addListener(port => {
//     console.assert(port.name == CONTENT_SCRIPT_PORT || port.name == REACT_APP_PORT);
//     console.log('port disconnected:', port);
//     switch (port.name) {
//         case CONTENT_SCRIPT_PORT:
//             console.log('TODO: disconnect content port');
//             break;

//         case REACT_APP_PORT:
//             console.log('TODO: disconnect react port');
//             break;

//         default:
//             console.error(
//                 "ERR: somehow disconnecting port isn't recognized, but we said assert!",
//                 port
//             );
//     }
// });