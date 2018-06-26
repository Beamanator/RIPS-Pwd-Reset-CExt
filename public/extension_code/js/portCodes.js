// ==============================================================================
//                       CODES FOR CHROME EXTENSION FILES
// ==============================================================================

// name of the react app / background.js port
const REACT_APP_PORT = 'REACT_APP_PORT';
// name of the content script / background.js port
const CONTENT_SCRIPT_PORT = 'CONTENT_SCRIPT_PORT';

// uncategorized
const INIT_PORT = 'INIT_PORT'; // also received in main.js
const ERROR_CODE_NOT_RECOGNIZED = 'ERROR_CODE_NOT_RECOGNIZED';
const USER_DATA_PAYLOAD = 'USER_DATA_PAYLOAD';
const NEXT_URL_REDIRECT = 'NEXT_URL_REDIRECT';
// CONTINUE_IMPORT also sent from background to content script

// receive codes (from background.js)
const START_IMPORT = 'START_IMPORT';
const CONTINUE_IMPORT = 'CONTINUE_IMPORT';