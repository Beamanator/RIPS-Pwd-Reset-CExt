import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class Logout extends Component {
    componentDidMount () {
        // redirect
        // method 1: forward history props into onLogout, then 
        //  redirect from there
        // method 2: just let Render redirect for us
        this.props.onLogout();
    }

    render () {
        return <Redirect to="/" />;
    }
}; 

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);