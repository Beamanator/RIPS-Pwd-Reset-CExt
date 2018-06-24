import React from 'react';

import classes from './Row.css';

const wrapCell = (type, content) => {
    // if no content, set to empty str
    if (!content) content = '';
    
    if (type === 'header') {
        return <th>{content}</th>;
    } else {
        return <td>{content}</td>;
    }
};

const row = (props) => {
    // if data not passed, set empty obj
    const data = props.data ? props.data : {};

    return (
        <tr className={classes.Container}>
            {wrapCell( props.type, data.username )}
            {wrapCell( props.type, data.email )}
            {wrapCell( props.type, data.lastPwdChange )}
        </tr>
    );
};

export default row;