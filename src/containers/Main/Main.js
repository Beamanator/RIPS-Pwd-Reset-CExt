/*global chrome*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spacer from '../../components/UI/Spacer/Spacer';
import Table from '../../components/Table/Table';

import * as actions from '../../store/actions/index';
import classes from './Main.css';

class Main extends Component {
    state = {
        formattedData: null,

        urgent: [],
        warning: [],
        normal: []
    }

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
        // rips data is source of truth, so loop through it, trying to add
        //  new props to each element
        const analyzedData = this.props.ripsData.reduce((acc, user) => {
            // get user's username
            const username = user.username;
            const todayString = (new Date()).toDateString();

            // get fb data about this user
            const fbUser = this.props.fbData[username];

            // create obj for table
            const tableUserData = {
                username: username,
                last_word: user.word,
                email: user.email
            };

            // if no data was found from fb, it's a new(ish) user
            if (!fbUser) {
                // automatically in the non-urgent password change group
                acc.normal.push( tableUserData );
            }
            
            // user already exists in fb, so analyze when password was changed last to figure
            //  out which urgency group user should go in
            else {
                // get last time this word was updated
                let lastUpdated = new Date(fbUser.last_updated);

                // calculate difference in days between now and last_updated
                // 1000 -> ms, 60 -> min, 60 -> hr, 24 -> days
                let numDays = Math.round(
                    (new Date() - lastUpdated) / (1000 * 60 * 60 * 24)
                );

                // < 5 months = 150 days = good / normal (no need to change yet)
                if (numDays < (5 * 30))
                    acc.normal.push( tableUserData );
                else if (numDays < (6.5 * 30)) // < 6.5 months
                    acc.warning.push( tableUserData );
                else // > 6.5 months :(
                    acc.urgent.push( tableUserData );
            }

            // create updated node for fb
            acc.formattedData[username] = {
                last_updated: todayString,
                last_word: user.word
            };

            return acc;
        }, {
            formattedData: {},
            urgent: [], warning: [], normal: []
        });

        this.setState({
            formattedData: analyzedData.formattedData,
            urgent: analyzedData.urgent,
            warning: analyzedData.warning,
            normal: analyzedData.normal
        })
    };

    getSaveDataBtn = () => (
        <Button
            btnType="Success"
            clicked={this.saveDataHandler}
        >[SAVE!]</Button>
    );
    saveDataHandler = () => {
        console.log('woot! save this.state.formattedData to FB now!');
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

        // once data is ready to be saved, show "save" button
        const saveElem = <div>Save? {this.getSaveDataBtn()}</div>;

        // extract tables & spacers - only display if there is data to display!
        let urgentData = null, warningData = null, normalData = null;
        if (this.state.urgent.length > 0) {
            urgentData = (
                <div>
                    <Spacer height='10px' />
                    <Table
                        title="CHANGE NOW"
                        type="Urgent"
                        data={this.state.urgent}
                    />
                </div>
            );
        }
        if (this.state.warning.length > 0) {
            warningData = (
                <div>
                    <Spacer height='10px' />
                    <Table
                        title="Change SOON"
                        type="Warning"
                        data={this.state.warning}
                    />
                </div>
            );
        }
        if (this.state.normal.length > 0) {
            normalData = (
                <div>
                    <Spacer height='10px' />
                    <Table
                        title="Changed Recently"
                        type="Normal"
                        data={this.state.normal}
                    />
                </div>
            );
        }

        return (
            <div>
                <div>WHEN DONE, PLEASE {logoutBtn}</div>
                <div>Connection Status: {connectionStatusContainer}</div>
                <div>Begin Data Collection: {beginCollectDataBtn}</div>
                <div>Data in Store: RIPS {ripsAvailElem} - Firebase {fbAvailElem}</div>
                {this.props.fbAvail && this.props.ripsAvail ? compileElem : null}
                {saveElem}
                {error}
                {urgentData}
                {warningData}
                {normalData}
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

        fbData: state.words.fbData,
        fbAvail: state.words.fbDataAvail,
        ripsData: state.words.ripsData,
        ripsAvail: state.words.ripsDataAvail,
        
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