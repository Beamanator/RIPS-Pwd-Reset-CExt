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
        urgent: [], warning: [], normal: []
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

    // componentWillUnmount() {
    //     Don't need to destroy the background port
    //     -> port will disconnect automatically
    // }
    
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
        // delete old state data
        this.setState({
            formattedData: null,
            urgent: [], warning: [], normal: []
        });
        // get new data from firebase & rips
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
            // get user's username & make date string of today
            const username = user.username, todayString = (new Date()).toDateString();

            // get fb data about this user
            const fbUserData = this.props.fbData || {};
            const fbNumUsers = Object.keys(fbUserData).length;

            // create user obj for tables
            const tableUserData = {
                username: username,
                // last_changed: <SET CONDITIONALLY BELOW>,
                email: user.email
            };

            // if no data was found from fb, it's a new(ish) user
            if (fbNumUsers === 0 || !fbUserData[username]) {
                // add last_changed as today!
                tableUserData.last_changed = todayString;

                // automatically add to the password change not needed group
                acc.normal.push( tableUserData );
            }
            
            // user already exists in fb, so analyze when password was changed
            //  last to figure out which urgency group user should go in
            else {
                // get user data from firebase
                const fbUser = fbUserData[username];

                // get last time this word was updated
                const lastUpdatedDate = new Date(fbUser.last_updated);

                // if _words are different, last_changed should be TODAY
                if (fbUser.last_word !== user.word) {
                    tableUserData.last_changed = todayString;

                    // changed today - push to 'normal' group
                    acc.normal.push( tableUserData );
                } else {
                    // words are same -> last_changed should be previous updated
                    //  date (unchanged)
                    tableUserData.last_changed = lastUpdatedDate.toDateString();

                    // calculate difference in days between now and last_updated
                    // 1000 -> ms, 60 -> min, 60 -> hr, 24 -> days
                    let numDays = Math.round(
                        (new Date() - lastUpdatedDate) / (1000 * 60 * 60 * 24)
                    );

                    // < 5 months = 150 days = good / normal (no need to change yet)
                    if (numDays < (5 * 30))
                        acc.normal.push( tableUserData );
                    else if (numDays < (6.5 * 30)) // < 6.5 months
                        acc.warning.push( tableUserData );
                    else // > 6.5 months :(
                        acc.urgent.push( tableUserData );
                }
            }

            // create updated node for fb
            acc.formattedData[username] = {
                last_updated: tableUserData.last_changed,
                last_word: user.word
            };

            return acc;
        }, {
            formattedData: {},
            urgent: [], warning: [], normal: []
        });

        // store to local state for display
        this.setState({
            formattedData: analyzedData.formattedData,
            urgent: analyzedData.urgent,
            warning: analyzedData.warning,
            normal: analyzedData.normal
        });
    };

    getSaveDataBtn = () => (
        <Button
            btnType="Success"
            clicked={this.saveDataHandler}
        >[SAVE!]</Button>
    );
    saveDataHandler = () => {
        // store formatted data to FB
        this.props.onFbStoreWords(this.state.formattedData, this.props.token);
    };

    getTableElem = (type, title) => (
        <div>
            <Spacer height='10px' />
            <Table
                title={title}
                type={type}
                data={this.state[type]}
            />
        </div>
    );

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
        // const fbStoreDone = this.props.fbStoreLoading ? 'Done' : '...';
        const saveElem = <div>Save? {this.getSaveDataBtn()} - Loading: {this.props.fbStoreSuccess}</div>;

        // extract tables & spacers - only display if there is data to display!
        let urgentData = null, warningData = null, normalData = null;
        if (this.state.urgent.length > 0) {
            urgentData = this.getTableElem("urgent", "CHANGE NOW");
        }
        if (this.state.warning.length > 0) {
            warningData = this.getTableElem("warning", "Change SOON");
        }
        if (this.state.normal.length > 0) {
            normalData = this.getTableElem("normal", "Changed Recently");
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
        
        ripsFetchLoading: state.words.ripsFetchLoading,
        fbFetchLoading: state.words.fbFetchLoading,
        fbStoreLoading: state.words.fbStoreLoading,
        fbStoreSuccess: state.words.fbStoreSuccess,

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
        onBackgroundPortInit: (chrome) => dispatch(actions.backgroundPortInit(chrome)),
        onFbStoreWords: (userData, token) => dispatch(actions.fbStoreWords(userData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);