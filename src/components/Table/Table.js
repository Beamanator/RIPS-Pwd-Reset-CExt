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
                    <Row type="header"/>
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