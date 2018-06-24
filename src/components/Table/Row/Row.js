import React from 'react';

import classes from './Row.css';

const row = (props) => {
    const wrapCell = content => {
        if (props.type === 'header') {
            return <th>{content}</th>;
        } else {
            return <td>{content}</td>;
        }
    };

    return (
        <tr className={classes.Container}>
            {wrapCell( 'Cell 1' )}
            {wrapCell( 'Cell 2!' )}
        </tr>
    );
};

export default row;