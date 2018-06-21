import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import App from './App';
import authReducer from './store/reducers/auth';
import wordsReducer from './store/reducers/words';
import portReducer from './store/reducers/port';
import './index.css';

// comment out service worker here & below to prevent unharmful error:
// -> Uncaught (in promise) TypeError: Request scheme 'chrome-extension' is unsupported
// -> https://github.com/facebook/create-react-app/issues/3144
// import registerServiceWorker from './registerServiceWorker';

// create-react-act dev environment specific
// process.env.NODE_ENV comes from config folder, env.js file
// basically, if we're in development mode, show redux store, but if not
// hide it from that extension.
const composeEnhancers = process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null
        || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    words: wordsReducer,
    port: portReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        {/* router wraps app, inside provider - if needed */}
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
// registerServiceWorker();
