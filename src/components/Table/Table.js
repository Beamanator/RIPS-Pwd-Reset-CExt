import React from 'react';

import Row from './Row/Row';

import classes from './Table.css';

const table = (props) => {
    const data = [
        {
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }
    ];

    return (
        <div className={classes.Container}>
            <p>Table Title</p>
            <table className={classes.Table}>
                <thead>
                    <Row type="header"/>
                </thead>
                <tbody>
                    <Row />
                    <Row />
                </tbody>
            </table>
        </div>
    );
}

export default table;