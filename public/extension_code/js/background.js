// ==============================================================================
//                               PORT HOLDERS
// ==============================================================================
let CSPort = null; // content script port
let RAPort = null; // react app port
let importInProgress = false;

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

// TODO: wrap these functions with port-sending error messages
const sendPortInit = (port, autoStartFlag) => {
    if (port) {
        port.postMessage({
            code: INIT_PORT,
            autoStart: autoStartFlag // if in progress, import should auto start
        });
    } else {
        console.error(`sendPortInit failed - ${port} not available!`);
        importInProgress = false;
    }
}
const sendStartImport = (port) => {
    if (port) {
        sendCodeOnly(port, START_IMPORT);
    } else {
        console.error(`sendStartImport failed - ${port} not available!`);
        importInProgress = false;
    }
};
const sendContinueImport = (port) => {
    if (port) {
        sendCodeOnly(port, CONTINUE_IMPORT);
    } else {
        console.error(`sendContinueImport failed - ${port} not available!`);
        importInProgress = false;
    }
}
const sendImportDone = (port) => {
    if (port) {
        sendCodeOnly(port, IMPORT_DONE);
    } else {
        console.error(`sendImportDone failed - ${port} not available!`);
        importInProgress = false;
    }
}
const sendUserDataToReact = (port, userData) => {
    if (port) {
        port.postMessage({
            code: USER_DATA_PAYLOAD,
            data: userData
        });
    } else {
        console.error(`sendUserDataToReact failed - ${port} not available!`);
        importInProgress = false;
    }
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
            case IMPORT_DONE:
                importInProgress = false;
                sendImportDone(RAPort);
                break;

            case USER_DATA_PAYLOAD:
                sendUserDataToReact(RAPort, msg.data);
                break;

            case NEXT_URL_REDIRECT:
                const msgTabId = MessageSender.sender.tab.id;

                chrome.tabs.update(msgTabId, { url: msg.url });
                break;

            case ERROR_CODE_NOT_RECOGNIZED:
                console.error(`${msg.source} - ${msg.data}`);
                importInProgress = false;
                break;

            case ERROR_HOW_TO_CONTINUE:
                console.error(`Too many '>' elems found on rips page!`);
                importInProgress = false;
                break;
            
            default: // code not recognized - send error back
                sendPortCodeError(port, msg.code);
                importInProgress = false;
        }
    });

    port.onDisconnect.addListener(removedPort => {
        console.log(`Port <${removedPort.name}> disconnected`);

        CSPort = null;
    });
}

const initReactAppPort = (port) => {
    // set global port var
    RAPort = port;

    port.onMessage.addListener(function(msg) {
        console.log('<background.js> react app port msg received', msg);

        switch(msg.code) {
            case START_IMPORT:
                importInProgress = true;
                sendStartImport(CSPort);
                break;

            case CONTINUE_IMPORT:
                sendContinueImport(CSPort);
                break;

            case ERROR_BKG_CODE_NOT_RECOGNIZED:
                importInProgress = false;
                console.error(`Code sent to React <${msg.errCode}> not recognized`);
                break;

            default: // code not recognized - send error back
                importInProgress = false;
                sendPortCodeError(port, msg.code);
        }
    });

    port.onDisconnect.addListener(removedPort => {
        console.log(`Port <${removedPort.name}> disconnected`);

        RAPort = null;
    });
}

// ==============================================================================
//                          PORT CONNECTION LISTENER
// ==============================================================================


// NOTE: onChange sets up long term connections!
chrome.runtime.onConnect.addListener(port => {
    console.assert(port.name == CONTENT_SCRIPT_PORT || port.name == REACT_APP_PORT);
    
    console.log(`Port <${port.name}> connected!`);

    // send init message
    sendPortInit(port, importInProgress);
    
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
            importInProgress = false;
            console.error(
                "ERR: somehow connecting port isn't recognized, but we said assert!",
                port
            );
    }
});