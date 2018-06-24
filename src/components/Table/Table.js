import React from 'react';

import Row from './Row/Row';

import classes from './Table.css';

const table = (props) => {
    const data = {
        Urgent: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }],
        Warning: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }],
        Normal: [{
            username: 'abeaman',
            lastPwdChange: '4 May 2018',
            email: 'spamalotmucho@gmail.com'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }, {
            username: 'staff',
            lastPwdChange: '1 Jan 2017',
            email: 'none'
        }]
    };

    // headers are all the same, so create const here
    const headerData = {
        username: 'Username',
        email: 'Email Address',
        lastPwdChange: 'Last Password Change'
    };

    // handle table header class (to figure out appropriate color)
    let tableHeaderClass = 'Normal'
    switch( props.type ) {
        case 'Urgent':
        case 'Warning':
        case 'Normal':
            tableHeaderClass = props.type;
            break;
        default:
            console.error(`Table type "${props.type}" not recognized`);
    }

    return (
        <div className={classes.Container}>
            <p className={classes.TableTitle}>{props.title}</p>
            <table className={classes.Table}>
                <thead className={classes[tableHeaderClass]}>
                    <Row type="header" data={headerData}/>
                </thead>
                <tbody className={classes.TableBody}>
                    <Row />
                    <Row />
                </tbody>
            </table>
        </div>
    );
}

export default table;