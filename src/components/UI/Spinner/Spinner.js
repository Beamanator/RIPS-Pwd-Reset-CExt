import React from 'react';

import classes from './Spinner.css';

// Spinner code copied from:
// https://projects.lukehaas.me/css-loaders/
const spinner = () => (
    <div className={classes.Loader}>Loading...</div>
);

export default spinner;