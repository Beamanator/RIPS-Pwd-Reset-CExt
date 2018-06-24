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
    
    logoutHandler = () => {
        this.props.onLogout();
    }

    render () {
        // extract logoutBtn code
        const logoutBtn = (
            <Button
                btnType="Danger"
                clicked={this.logoutHandler}
            >[LOGOUT]</Button>
        );

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

        return (
            <div>
                <div>WHEN DONE, PLEASE {logoutBtn}</div>
                <div>Connection Status: {connectionStatusContainer}</div>
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
        userData: state.words.userData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onCollectPwds: () => dispatch(),
        onBackgroundPortInit: (chrome) => dispatch(actions.backgroundPortInit(chrome))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);