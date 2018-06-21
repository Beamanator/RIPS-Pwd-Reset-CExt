import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auth from './containers/Auth/Auth';
import Main from './containers/Main/Main';

import * as actions from './store/actions/index';
// import logo from './logo.svg';
import classes from './App.css';

class App extends Component {
    componentDidMount() {
        console.log('try to auto sign in!');
        // this.props.onTryAutoSignin();
    }
    
    render() {
        return (
            <div className={classes.App}>
                <Auth />
                <Main />
            </div>
        );

        // return (
        //     <div className={classes.App}>
        //         <header className={classes.AppHeader}>
        //             <img
        //                 src={logo}
        //                 className={classes.AppLogo}
        //                 alt="logo" />
        //             <h1 className={classes.AppTitle}>Welcome to React</h1>
        //         </header>
        //         <p className={classes.AppIntro}>
        //             To get started, edit <code>src/App.js</code> and save to reload.
        //         </p>
        //     </div>
        // );
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
