import axios from 'axios';
import { apiKey } from '../../shared/auth/apiKey';

import * as actionTypes from '../actions/actionTypes';

// AUTH action creator functions go here

// called in auth()
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

// called in auth() && authCheckState()
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

// called in auth()
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

// called in authCheckState()
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

// called in auth() && authCheckState()
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};


/**
 * Function starts the process of authenticating a user.
 * 1. dispatch authStart
 * 2. 
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
export const auth = (email, password) => {
    return dispatch => {
        // ... authenticate user
        dispatch(authStart());

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        // sign in url
        let url = 'https://www.googleapis.com/identitytoolkit/v3/' +
            'relyingparty/verifyPassword?key=' + apiKey;

        axios.post(url, authData)
        .then(res => {
            const expirationDate = new Date(
                new Date().getTime() +
                (res.data.expiresIn * 1000)
            );
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', res.data.localId);
            
            dispatch(authSuccess(
                res.data.idToken,
                res.data.localId
            ));
            dispatch(checkAuthTimeout(
                res.data.expiresIn
            ));
        })
        .catch(err => {
            dispatch(authFail(err.response.data.error));
        });
    };
};

/**
 * Function checks if user is logged in by checking for 'token' in
 * local storage.
 * If not found, dispatch logout
 * If found, checks expiration date.
 *      If not expired, dispatch authSuccess (log in)
 *          Then dispatch checkAuthTimeout
 *      If expired, dispatch logout
 *
 * @returns
 */
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch(logout()); // not logged in - may as well logout
        } else {
            const expirationDate = new Date(
                localStorage.getItem('expirationDate')
            );

            if (expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                
                // expires in the future, so log in!
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((
                    expirationDate.getTime() -
                    new Date().getTime()
                ) / 1000));
            } else {
                // expired, so logout
                dispatch(logout());
            }
        }
    };
};