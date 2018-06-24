import React from 'react';

import { updateObject } from '../../../shared/utils';

const defaultStyles = {
    backgroundColor: null, // for testing
    height: '100px',
    width: '100%'
};

const spacer = (props) => {
    const styles = updateObject(props, {
        backgroundColor: props.backgroundColor || defaultStyles.backgroundColor,
        height: props.height || defaultStyles.height,
        width: props.width || defaultStyles.width
    });

    return (
        <div style={styles}></div>
    )
}

export default spacer;