/*global chrome*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spacer from '../../components/UI/Spacer/Spacer';
import Table from '../../components/Table/Table';

import * as actions from '../../store/actions/index';
import classes from './Main.css';

class Main extends Component {
    componentDidMount() {
        console.log('<Main> NODE_ENV:',process.env.NODE_ENV);
        // Warn user if we're in development environment
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                '<Main> not initializing ports since not in chrome extension code'
            );
        }
        // Check if port exists. Set one up if not!
        else if (!this.props.bkgPort) {
            // store port in redux store
            this.props.onBackgroundPortInit(chrome);
        } else {
            console.warn('<Main> port already exists', this.props.bkgPort);
        }
    }

    componentWillUnmount() {
        // TODO: destroy the background port - call action!
    }
    
    getLogoutBtn = () => (
        <Button
            btnType="Danger"
            clicked={this.logoutHandler}
        >[LOGOUT]</Button>
    );
    logoutHandler = () => {
        this.props.onLogout();
    }

    getBeginCollectDataBtn = () => (
        <Button
            btnType="Success"
            clicked={this.beginCollectDataHandler}
        >[START]</Button>
    );
    beginCollectDataHandler = () => {
        this.props.onFbFetchWords(this.props.token);
        this.props.onRipsFetchWords(this.props.bkgPort);
    };

    getCompileDataBtn = () => (
        <Button
            btnType="Success"
            clicked={this.compileDataHandler}
        >[COMPILE!]</Button> 
    );
    compileDataHandler = () => {
        console.log('time to compile data!');
    };

    render () {
        // extract logoutBtn code
        const logoutBtn = this.getLogoutBtn();

        // extract beginAnalysisBtn code
        const beginCollectDataBtn = this.getBeginCollectDataBtn();

        // extract connection status code
        let connectionStatus, connectionStatusClass;
        if ( this.props.bkgPort ) {
            connectionStatus = 'CONNECTED';
            connectionStatusClass = 'Connected';
        } else {
            connectionStatus = 'NOT CONNECTED';
            connectionStatusClass = 'Disconnected';
        }
        const connectionStatusContainer = (
            <span className={classes[connectionStatusClass]}>{connectionStatus}</span>
        );

        // extra error text here
        let error = null;
        if (this.props.error && this.props.error.message) {
            error = <div>this.props.error.message</div>;
        }

        // set data available text
        let ripsAvailText = '[NO]', ripsAvailClass = classes.Disconnected,
            fbAvailText = '[NO]', fbAvailClass = classes.Disconnected;
        if (this.props.ripsFetchLoading) {
            ripsAvailText = '[...]';
        } else if (this.props.ripsAvail) {
            ripsAvailText = '[YES]';    ripsAvailClass = classes.Connected;
        }
        if (this.props.fbFetchLoading) {
            fbAvailText = '[...]';
        } else if (this.props.fbAvail) {
            fbAvailText = '[YES]';      fbAvailClass = classes.Connected;
        }
        const ripsAvailElem = <span className={ripsAvailClass}>{ripsAvailText}</span>,
            fbAvailElem = <span className={fbAvailClass}>{fbAvailText}</span>

        // if all data is available, show "compile" button!
        const compileElem = <div>Ready! Press it: {this.getCompileDataBtn()}</div>;

        return (
            <div>
                <div>WHEN DONE, PLEASE {logoutBtn}</div>
                <div>Connection Status: {connectionStatusContainer}</div>
                <div>Begin Data Collection: {beginCollectDataBtn}</div>
                <div>Data in Store: RIPS {ripsAvailElem} - Firebase {fbAvailElem}</div>
                {this.props.fbAvail && this.props.ripsAvail ? compileElem : null}
                {error}
                <Spacer height='10px' />
                <Table
                    title="CHANGE NOW"
                    type="Urgent"
                    data={this.props.userData.Urgent}
                />
                <Spacer height='10px' />
                <Table
                    title="Change SOON"
                    type="Warning"
                    data={this.props.userData.Warning}
                />
                <Spacer height='10px' />
                <Table
                    title="Changed Recently"
                    type="Normal"
                    data={this.props.userData.Normal}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        bkgPort: state.port.port,
        
        fbFetchLoading: state.words.fbFetchLoading,
        fbStoreLoading: state.words.fbStoreLoading,
        ripsFetchLoading: state.words.ripsFetchLoading,

        fbAvail: state.words.fbDataAvail,
        ripsAvail: state.words.ripsDataAvail,
        
        userData: state.words.userData,
        error: state.words.error,

        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onFbFetchWords: (token) => dispatch(actions.fbFetchWords(token)),
        onRipsFetchWords: (port) => dispatch(actions.ripsFetchWords(port)),
        onBackgroundPortInit: (chrome) => dispatch(actions.backgroundPortInit(chrome))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);