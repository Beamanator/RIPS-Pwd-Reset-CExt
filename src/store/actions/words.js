// import axios from 'axios';

import * as actionTypes from '../actions/actionTypes';

// WORDS action creator functions go here

// store words to FB db, right?
export const fbStoreWords = () => {
    return {
        type: actionTypes.STORE_WORDS
    };
};

export const fbFetchWords = () => {
    return dispatch => {
        // dispatch(wordsStart());

        // type: actionTypes.FETCH_WORDS
        // TODO: get words from FB here? These should be displayed somehow right?
    };
};

export const harvestWords = () => {
    return dispatch => {
        // TODO: send message to background.js to begin harvesting?

        // start spinner until data comes back?
    }
};