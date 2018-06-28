// ==============================================================================
//                           CODES FOR REACT APP FILES
// ==============================================================================

// constant to hold the name of the react app / background.js port
export const REACT_APP_PORT = 'REACT_APP_PORT';

// receive codes
export const INIT_PORT = 'INIT_PORT';
export const ERROR_CODE_NOT_RECOGNIZED = 'ERROR_CODE_NOT_RECOGNIZED';
export const USER_DATA_PAYLOAD = 'USER_DATA_PAYLOAD';

// send codes (to background.js)
export const START_IMPORT = 'START_IMPORT';
export const CONTINUE_IMPORT = 'CONTINUE_IMPORT';
export const IMPORT_DONE = 'IMPORT_DONE';

// comes with payload errCode (code that errored in actions/port.js)
export const ERROR_BKG_CODE_NOT_RECOGNIZED = 'ERROR_BKG_CODE_NOT_RECOGNIZED';