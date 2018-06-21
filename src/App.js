import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auth from './containers/Auth/Auth';
import Main from './containers/Main/Main';

import * as actions from './store/actions/index';
import classes from './App.css';

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignin();
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
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignin: () => dispatch(actions.authCheckState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
