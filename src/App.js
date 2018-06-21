/*global chrome*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auth from './containers/Auth/Auth';
import Main from './containers/Main/Main';
import Spinner from './components/UI/Spinner/Spinner';

import * as actions from './store/actions/index';
import classes from './App.css';

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignin();

        // if no port exists, set one up!
        if (!this.props.bkgPort) {
            // store port in redux store
            this.props.onBackgroundPortInit(chrome);
        } else {
            console.warn('<App> port already exists', this.props.bkgPort);
        }
    }

    componentWillUnmount() {
        // TODO: destroy the background port - call action!
    }
    
    render() {
        let elem, welcomeMsg;
        if (this.props.isAuthenticated) {
            elem = <Main />;
            welcomeMsg = 'check reset status';
        } else {
            elem = <Auth />;
            welcomeMsg = 'sign in';
        }

        return (
            <div className={classes.App}>
                <h1>{`Welcome! Please ${welcomeMsg}!`}</h1>
                {elem}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        bkgPort: state.port.port
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignin: () => dispatch(actions.authCheckState()),
        onBackgroundPortInit: (chrome) => dispatch(actions.backgroundPortInit(chrome))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
