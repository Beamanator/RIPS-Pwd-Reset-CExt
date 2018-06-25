import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utils';

const initialState = {
    words: [],
    error: null,
    loading: false,
    fbData: null,
    ripsData: null,
    // NOTE: emails come from RIPS, NOT STORED IN FB
    userData: {
        Urgent: [{
            username: 'abeaman',
            last_word: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff1',
            last_word: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff2',
            last_word: '1 Jan 2017',
            email: 'none'
        }],
        Warning: [{
            username: 'abeaman',
            last_word: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff6',
            last_word: '1 Jan 2017',
            email: 'none'
        }],
        Normal: [{
            username: 'abeaman',
            last_word: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff3',
            last_word: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff4',
            last_word: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff5',
            last_word: '1 Jan 2017',
            email: 'none'
        }]
    }
};

// collect words from RIPS website
const ripsFetchStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};
const ripsFetchSuccess = (state, action) => {
    return updateObject(state, {
        error: null, loading: false, ripsData: action.userData
    });
};
const ripsFetchFail = (state, action) => {
    return updateObject(state, { error: action.error, loading: false });
};

// get words from FB database
const fbFetchStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};
const fbFetchSuccess = (state, action) => {
    return updateObject(state, {
        error: null, loading: false, fbData: action.userData
    });
};
const fbFetchFail = (state, action) => {
    return updateObject(state, { error: action.error, loading: false });
};

// store words to FB database
const fbStoreStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};
const fbStoreSuccess = (state, action) => {
    return updateObject(state, {
        error: null, loading: false, userData: action.userData
    });
};
const fbStoreFail = (state, action) => {
    return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        // get -> RIPS
        case actionTypes.COLLECT_RIPS_WORDS_START: return ripsFetchStart(state, action);
        case actionTypes.COLLECT_RIPS_WORDS_SUCCESS: return ripsFetchSuccess(state, action);
        case actionTypes.COLLECT_RIPS_WORDS_FAIL: return ripsFetchFail(state, action);
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