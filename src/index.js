import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
// TODO: add react-thunk

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import authReducer from './store/reducers/auth';

import './index.css';

const rootReducer = combineReducers({
    auth: authReducer
});

const store = createStore(rootReducer);

const app = (
    <Provider store={store}>
        {/* router wraps app, inside provider - if needed */}
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
