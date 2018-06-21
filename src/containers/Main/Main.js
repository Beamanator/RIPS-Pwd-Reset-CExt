import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';

import classes from './Main.css';

class Main extends Component {
    logoutHandler = () => {
        console.log('logout');
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
                <p>Main content here</p>
            </div>
        );
    }
}

// const mapStateToProps = state => {}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Main);