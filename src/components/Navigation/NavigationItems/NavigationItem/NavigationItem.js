import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink
            to={props.link}
            exact={props.exact}
            // need to tell NavLink the class to use, since css modules
            // makes a random has name that is unique.
            activeClassName={classes.active}
        >{props.children}</NavLink>
    </li>
);

export default navigationItem;