/*global chrome*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
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
        const logoutBtn = (
            <Button
                btnType="Danger"
                clicked={this.logoutHandler}
            >LOGOUT</Button>
        );

        return (
            <div>
                <p>WHEN DONE, PLEASE {logoutBtn}</p>
                {/* TODO: put status of connection to RIPS manager here! */}
                {/* TODO: add main content data below */}
                <p>Main content here</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        bkgPort: state.port.port
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