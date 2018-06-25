import * as actionTypes from './actionTypes';
import axios from '../../axios-words';

export const fbFetchStart = () => {
    return {
        type: actionTypes.FB_FETCH_START
    };
};
export const fbFetchSuccess = (data) => {
    return {
        type: actionTypes.FB_FETCH_SUCCESS,
        userData: data
    };
};
export const fbFetchFail = (error) => {
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

export const fbStoreStart = () => {
    return {
        type: actionTypes.FB_STORE_START
    };
};
export const fbStoreSuccess = (data) => {
    return {
        type: actionTypes.FB_STORE_SUCCESS,
        userData: data
    };
};
export const fbStoreFail = (error) => {
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
export const ripsFetchStart = () => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_START
    };
};
// success!
export const ripsFetchSuccess = (data) => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_SUCCESS,
        userData: data
    };
};
// fail :(
export const ripsFetchFail = (error) => {
    return {
        type: actionTypes.COLLECT_RIPS_WORDS_FAIL,
        error: error
    };
};
// KICK OFF PROCESS - collect rips words from the website
export const ripsFetchWords = () => {
    return dispatch => {
        // begin collecting words
        dispatch(ripsFetchStart());

        // TODO: send message to background to start collecting data here
        // if succeed, dispatch success. if error, dispatch error
    };
};