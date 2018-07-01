import React from 'react';

import Row from './Row/Row';

import classes from './Table.css';

const table = (props) => {
    // headers are all the same, so create const here
    const headerData = {
        username: 'Username',
        email: 'Email Address',
        last_changed: 'Last Password Change'
    };

    // handle table header class (to figure out appropriate color)
    let tableHeaderClass = 'Normal'
    switch( props.type ) {
        case 'urgent':
        case 'warning':
        case 'normal':
            tableHeaderClass = props.type;
            break;
        default:
            console.error(`Table type "${props.type}" not recognized`);
    }

    // create rows dynamically
    const userData = props.data.map(user => (
        <Row
            key={user.username}
            type={props.type}
            data={user}
        />
    ));

    return (
        <div className={classes.Container}>
            <p className={classes.TableTitle}>{props.title}</p>
            <table className={classes.Table}>
                <thead className={classes[tableHeaderClass]}>
                    <Row type="header" data={headerData}/>
                </thead>
                <tbody className={classes.TableBody}>
                    {userData}
                </tbody>
            </table>
        </div>
    );
}

export default table;