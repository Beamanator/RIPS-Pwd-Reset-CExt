// ==============================================================================
//                               PORT HOLDERS
// ==============================================================================
let CSPort = null; // content script port
let RAPort = null; // react app port

// ==============================================================================
//                          MESSAGE POSTING FUNCTIONS
// ==============================================================================
// Note: port codes come from "../js/portCodes.js"
const sendPortCodeError = (port, invalidCode) => {
    port.postMessage({
        code: ERROR_CODE_NOT_RECOGNIZED, source: 'background.js',
        data: `Code <${invalidCode}> not recognized!`
    });
};

const sendCodeOnly = (port, code) => {
    port.postMessage({ code: code });
};

const sendPortInit = (port) => sendCodeOnly(port, INIT_PORT);
const sendStartImport = (port) => {
    if (port) sendCodeOnly(port, START_IMPORT);
    else console.error(`sendStartImport failed - ${port} not available!`);
};
const sendContinueImport = (port) => {
    if (port) sendCodeOnly(port, CONTINUE_IMPORT);
    else console.error(`sendContinueImport failed - ${port} not available!`);
}

const sendUserDataToReact = (port, userData) => {
    if (port) {
        port.postMessage({
            code: USER_DATA_PAYLOAD,
            data: userData
        });
    }
    else console.error(`sendUserDataToReact failed - ${port} not available!`);
};

// ==============================================================================
//                               PORT LISTENERS
// ==============================================================================

const initContentScriptPort = (port) => {
    // set global port var
    CSPort = port;

    port.onMessage.addListener(function(msg, MessageSender) {
        console.log('<background.js> content script port msg received', msg);

        switch(msg.code) {
            case USER_DATA_PAYLOAD:
                sendUserDataToReact(RAPort, msg.data);
                break;

            case NEXT_URL_REDIRECT:
                const msgTabId = MessageSender.sender.tab.id;

                chrome.tabs.update(msgTabId, { url: msg.url });
                break;

            case ERROR_CODE_NOT_RECOGNIZED:
                console.error(`${msg.source} - ${msg.data}`);
                break;
            
            default: // code not recognized - send error back
                sendPortCodeError(port, msg.code);
        }
    });
}

const initReactAppPort = (port) => {
    // set global port var
    RAPort = port;

    port.onMessage.addListener(function(msg) {
        console.log('<background.js> react app port msg received', msg);

        switch(msg.code) {
            case START_IMPORT:
                sendStartImport(CSPort);
                break;

            case CONTINUE_IMPORT:
                sendContinueImport(CSPort);
                break;

            default: // code not recognized - send error back
                sendPortCodeError(port, msg.code);
        }
    });
}

// ==============================================================================
//                          PORT CONNECTION LISTENER
// ==============================================================================


// NOTE: onChange sets up long term connections!
chrome.runtime.onConnect.addListener(port => {
    console.assert(port.name == CONTENT_SCRIPT_PORT || port.name == REACT_APP_PORT);
    
    // send init message
    // TODO: continue import if setting is set to do so!
    sendPortInit(port);
    
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