import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utils';

const initialState = {
    words: [],
    error: null,

    fbStoreSuccess: null,
    fbStoreloading: false,
    fbFetchLoading: false,
    fbDataAvail: false,
    fbData: null,

    ripsFetchLoading: false,
    ripsDataAvail: false,
    ripsData: []
};

// collect words from RIPS website
const ripsFetchStart = (state, action) => {
    return updateObject(state, {
        error: null,
        ripsFetchLoading: true,
        ripsDataAvail: false,
        ripsData: []
    });
};
const ripsFetchSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        ripsFetchLoading: false,
        ripsDataAvail: true
        // ripsData: action.userData // -> do this in ripsAddUserData
    });
};
const ripsFetchFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        ripsFetchLoading: false,
        ripsDataAvail: false,
        ripsData: []
    });
};
const ripsAddUserData = (state, action) => {
    return updateObject(state, {
        error: null,
        ripsFetchLoading: true,
        ripsDataAvail: false,
        ripsData: action.userData.concat(state.ripsData)
    });
};

// get words from FB database
const fbFetchStart = (state, action) => {
    return updateObject(state, {
        error: null,
        fbFetchLoading: true,
        fbDataAvail: false,
        fbData: null
    });
};
const fbFetchSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        fbFetchLoading: false,
        fbDataAvail: true,
        fbData: action.userData
    });
};
const fbFetchFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        fbFetchLoading: false,
        fbDataAvail: false,
        fbData: null
    });
};

// store words to FB database
const fbStoreStart = (state, action) => {
    return updateObject(state, {
        error: null, fbStoreloading: true, fbStoreSuccess: null
    });
};
const fbStoreSuccess = (state, action) => {
    return updateObject(state, {
        error: null, fbStoreloading: false, fbStoreSuccess: action.statusText
    });
};
const fbStoreFail = (state, action) => {
    return updateObject(state, {
        error: action.error, fbStoreloading: false, fbStoreSuccess: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        // get -> RIPS
        case actionTypes.RIPS_FETCH_START: return ripsFetchStart(state, action);
        case actionTypes.RIPS_FETCH_SUCCESS: return ripsFetchSuccess(state, action);
        case actionTypes.RIPS_FETCH_FAIL: return ripsFetchFail(state, action);
        case actionTypes.RIPS_ADD_USER_DATA: return ripsAddUserData(state, action);
        // get -> FB
        case actionTypes.FB_FETCH_START: return fbFetchStart(state, action);
        case actionTypes.FB_FETCH_SUCCESS: return fbFetchSuccess(state, action);
        case actionTypes.FB_FETCH_FAIL: return fbFetchFail(state, action);
        // store -> FB
        case actionTypes.FB_STORE_START: return fbStoreStart(state, action);
        case actionTypes.FB_STORE_SUCCESS: return fbStoreSuccess(state, action);
        case actionTypes.FB_STORE_FAIL: return fbStoreFail(state, action);

        default:
            return state;
    };
};

export default reducer;