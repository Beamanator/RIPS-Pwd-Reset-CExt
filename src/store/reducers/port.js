import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utils';

const initialState = {
    port: null,
    error: null
};

const portSet = (state, action) => {
    return updateObject(state, {
        port: action.port, error: null
    });
};

const portRemove = (state, action) => {
    return updateObject(state, {
        port: null, error: null
    });
};

const portError = (state, action) => {
    return updateObject(state, {
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BACKGROUND_PORT_SET: return portSet(state, action);
        case actionTypes.BACKGROUND_PORT_REMOVE: return portRemove(state, action);
        case actionTypes.BACKGROUND_PORT_ERROR: return portError(state, action);

        default:
            return state;
    }
};

export default reducer;