import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utils';

const initialState = {
    words: [],
    error: null,
    loading: false,
    fbData: null,
    ripsData: null,
    userData: {
        Urgent: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff1',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff2',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }],
        Warning: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff6',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }],
        Normal: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff3',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff4',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff5',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }]
    }
};

// collect words from RIPS website
const collectRIPSWordsStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};
const collectRIPSWordsSuccess = (state, action) => {
    return updateObject(state, {
        error: null, loading: false, userData: action.userData
    });
};
const collectRIPSWordsFail = (state, action) => {
    return updateObject(state, { error: action.error, loading: false });
};

// get words from FB database
const fbFetchStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};
const fbFetchSuccess = (state, action) => {
    return updateObject(state, {
        error: null, loading: false, userData: action.userData
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
        // collect -> RIPS
        case actionTypes.COLLECT_RIPS_WORDS_START: return collectRIPSWordsStart(state, action);
        case actionTypes.COLLECT_RIPS_WORDS_SUCCESS: return collectRIPSWordsSuccess(state, action);
        case actionTypes.COLLECT_RIPS_WORDS_FAIL: return collectRIPSWordsFail(state, action);
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