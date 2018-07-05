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
        axios.get('/pwd_holder.json?auth=' + token)
        .then(res => {
            const userData = res.data;

            let formattedUserData = {};

            // replace any '_' chars with '.' in keys (usernames) to match rips 
            // -> didn't have to replace '-' for some reason. maybe all of this
            //    isn't completely necessary haha
            for (let username in userData) {
                const regex = new RegExp(/_/, "g");
                const newUsername = username.replace(regex, ".");

                formattedUserData[newUsername] = userData[username];
            }

            dispatch(fbFetchSuccess(formattedUserData));
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
const fbStoreSuccess = (msg) => {
    return {
        type: actionTypes.FB_STORE_SUCCESS,
        statusText: msg
    };
};
const fbStoreFail = (error) => {
    return {
        type: actionTypes.FB_STORE_FAIL,
        error: error
    };
};
// KICK OFF PROCESS - store rips words to firebase
export const fbStoreWords = (userData, token) => {
    return dispatch => {
        dispatch(fbStoreStart());

        let formattedUserData = {};

        // replace any '.' chars with '_' in keys (usernames) for valid json
        // -> didn't have to replace '-' for some reason. maybe all of this
        //    isn't completely necessary haha
        for (let username in userData) {
            const regex = new RegExp(/\./, "g");
            const newUsername = username.replace(regex, "_");

            formattedUserData[newUsername] = userData[username];
        }

        // store words to FB
        // POST will add a unique id before the data, PATCH should allow us to
        //  edit as we like
        axios.patch('/pwd_holder.json?auth=' + token, formattedUserData)
        .then(response => {
            console.log('success response -> ', response);
            // Should we do anything with the response?
            const statusText = response.statusText;
            dispatch(fbStoreSuccess(statusText));
        })
        .catch(err => {
            dispatch(fbStoreFail(err.message));
        });
    };
};

// tell UI the process has started
const ripsFetchStart = () => {
    return {
        type: actionTypes.RIPS_FETCH_START
    };
};
// fail :(
const ripsFetchFail = (error) => {
    return {
        type: actionTypes.RIPS_FETCH_FAIL,
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

        // NOTE: data import actions called in actions/port.js - via port listener
    };
};
// success! done! - called in port.js actions
export const ripsFetchSuccess = () => {
    return {
        type: actionTypes.RIPS_FETCH_SUCCESS
    };
};
// add payload data to store!
export const ripsAddUserData = (data) => {
    return {
        type: actionTypes.RIPS_ADD_USER_DATA,
        userData: data
    };
};