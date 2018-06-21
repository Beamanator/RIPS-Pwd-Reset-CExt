import * as actionTypes from '../actions/actionTypes';

const REACT_APP_PORT = 'REACT_APP_PORT';
const INIT_PORT = 'INIT_PORT';

// store background port in store
const backgroundPortSet = (port) => {
    console.log('<port action> setting port');
    return {
        type: actionTypes.BACKGROUND_PORT_SET,
        port: port
    };
};

// remove background port in store
export const backgroundPortRemove = () => {
    console.log('<port action> removing port');
    return {
        type: actionTypes.BACKGROUND_PORT_REMOVE
    };
};

export const backgroundPortInit = (chrome) => {
    console.log('<port action> init port');
    return dispatch => {
        // set up local port
        const port = chrome.runtime.connect({name: REACT_APP_PORT});

        // wait for port to tell us we're connected
        port.onMessage.addListener(msg => {
            // make sure code is something
            console.assert( msg.code && msg.code.trim() !== '');
            switch( msg.code ) {
                case
                    INIT_PORT: dispatch(backgroundPortSet(port));
                    break;
                default:
                    console.error('REACT MSG CODE NOT VALID', msg);
            }
        })

        // next, (in callback) set port in redux store
        // dispatch(backgroundPortSet(port));
    };
};