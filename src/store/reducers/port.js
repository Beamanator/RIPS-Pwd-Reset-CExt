import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utils';

const initialState = {
    port: null,
    error: null
};

const backgroundPortSet = (state, action) => {
    return updateObject(state, {
        port: action.port
    });
};

const backgroundPortRemove = (state, action) => {
    return updateObject(state, {
        port: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BACKGROUND_PORT_SET: return backgroundPortSet(state, action);
        case actionTypes.BACKGROUND_PORT_REMOVE: return backgroundPortRemove(state, action);
        default:
            return state;
    }
};

export default reducer;