import React from 'react';

import classes from './Row.css';

const wrapCellContent = (type, content) => {
    // if no content, set to empty str
    if (!content) content = '';
    
    if (type === 'header') {
        return <th className={classes.HeadCell}>{content}</th>;
    } else {
        return <td className={classes.Cell}>{content}</td>;
    }
};

const row = (props) => {
    // if data not passed, set empty obj
    const data = props.data ? props.data : {};

    return (
        <tr className={classes.Container}>
            {wrapCellContent( props.type, data.username )}
            {wrapCellContent( props.type, data.email )}
            {wrapCellContent( props.type, data.lastPwdChange )}
        </tr>
    );
};

export default row;