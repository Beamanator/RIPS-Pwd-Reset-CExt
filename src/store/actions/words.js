import * as actionTypes from './actionTypes';
import * as portCodes from '../portCodes';
import axios from '../../axios-words';

const fbFetchStart = () => {
    return {
        type: actionTypes.FB_FETCH_START
    };
};
const fbFetchSuccess = (data) => {
    return {
        type: actionTypes.FB_FETCH_SUCCESS,
        userData: data
    };
};
const fbFetchFail = (error) => {
    return {
        type: actionTypes.FB_FETCH_FAIL,
        error: error
    };
};
// KICK OFF PROCESS - get rips words from firebase
export const fbFetchWords = (token) => {
    return dispatch => {
        dispatch(fbFetchStart());

        // get words from FB here
        const queryParams = `?auth=${token}`;
        axios.get('/pwd_holder.json' + queryParams)
        .then(res => {
            const fetchedWords = res.data;

            dispatch(fbFetchSuccess(fetchedWords));
        })
        .catch(err => {
            dispatch(fbFetchFail(err));
        });
    };
};

const fbStoreStart = () => {
    return {
        type: actionTypes.FB_STORE_START
    };
};
const fbStoreSuccess = (data) => {
    return {
        type: actionTypes.FB_STORE_SUCCESS,
        userData: data
    };
};
const fbStoreFail = (error) => {
    return {
        type: actionTypes.FB_STORE_FAIL,
        error: error
    };
};
// KICK OFF PROCESS - store rips words to firebase
export const fbStoreWords = () => {
    return dispatch => {
        dispatch(fbFetchStart());

        // TODO: store words to FB here
        // if succeed, dispatch success. if error, dispatch error
    };
};

// tell UI the process has started
const ripsFetchStart = () => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_START
    };
};
// success!
const ripsFetchSuccess = (data) => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_SUCCESS,
        userData: data
    };
};
// fail :(
const ripsFetchFail = (error) => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_FAIL,
        error: error
    };
};
// KICK OFF PROCESS - collect rips words from the website
export const ripsFetchWords = (port) => {
    return dispatch => {
        // begin collecting words
        dispatch(ripsFetchStart());

        // if in development mode, port may not be available
        if (!port) {
            const errMsg = 'No Port available! Check connection & environment';
            dispatch(ripsFetchFail(errMsg));
            return;
        }

        // Here, send message to background to start collecting data
        port.postMessage({ code: portCodes.START_IMPORT });

        // if succeed, dispatch success. if error, dispatch error
        // NOTE: success / fail may come in port.js - message listener
    };
};