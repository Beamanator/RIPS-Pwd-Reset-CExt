// export all action creators from different files here
// -> makes importing them into components easy!

export {
    auth,
    logout,
    // setAuthRedirectPath,
    authCheckState
} from './auth';

export {
    backgroundPortInit
} from './port';

export {
    fbFetchWords,
    collectRIPSWords
} from './words';