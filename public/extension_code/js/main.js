// ==============================================================================
//                                PORT CONNECT
// ==============================================================================
const port = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });

// ==============================================================================
//                               MAIN FUNCTIONS
// ==============================================================================
const startImport = () => {
    // Note: url should be right, since this only runs on the correct page
    // get the elements we need to search through, and map to useful array
    const rowNodes = document.querySelectorAll('table.webGrid tbody tr');

    // convert nodeArray to array, then map values (using Array.from())
    const userData = Array.from(rowNodes, row => {
        const cells = row.getElementsByTagName('td');

        // interesting cells are index: 1 [username], 2 [word], 6 [email]
        return {
            username:   cells[1].innerText,
            word:       cells[2].innerText,
            email:      cells[6].innerText
        };
    });

    // send it to background.js
    sendUserData(userData);
};

const continueImport = () => {
    // get array of page links with symbol '>' - meaning there's another page
    //  to get data from
    const nextPageElem =
        Array.from(document.querySelectorAll('table.webGrid tfoot a'))
        .filter(elem => {
            return elem.innerText === '>'
        });

    // if there's none left, we're done!
    if (nextPageElem.length === 0) {
        port.postMessage({ code: IMPORT_DONE });
    }

    // if some are available, only be happy if there's only 1 :)
    else if (nextPageElem.length === 1) {
        // navigate to next page of users
        const nextURL = nextPageElem[0].href;

        sendUrlRedirect(nextURL);
    }

    // if there are many, throw error!
    else {
        port.postMessage({ code: ERROR_HOW_TO_CONTINUE });
    }
}

// ==============================================================================
//                          MESSAGE POSTING FUNCTIONS
// ==============================================================================
// Note: port codes come from "../js/portCodes.js"
const sendUserData = (data) => {
    port.postMessage({
        code: USER_DATA_PAYLOAD,
        data: data
    });
};
const sendPortCodeError = (invalidCode) => {
    port.postMessage({
        code: ERROR_CODE_NOT_RECOGNIZED, source: 'main.js',
        data: `Code <${invalidCode}> not recognized!`
    });
};
const sendUrlRedirect = (nextUrl) => {
    port.postMessage({ code: NEXT_URL_REDIRECT, url: nextUrl });
};

// ==============================================================================
//                               PORT LISTENERS
// ==============================================================================

port.onMessage.addListener(function(msg) {
    console.log('<Main.js> port msg received', msg);

    switch(msg.code) {
        case START_IMPORT:
            startImport();
            break;

        case CONTINUE_IMPORT:
            continueImport();
            break;
        
        case INIT_PORT:
            console.log('Successfully connected to background.js');
            // if autoStart flag is true, start automatically!
            if (msg.autoStart) {
                startImport();
            }
            break;

        default: // code not recognized - send error back
            sendPortCodeError(msg.code);
    }
});