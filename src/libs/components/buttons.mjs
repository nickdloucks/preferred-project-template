import React from 'react';
import PropTypes from 'prop-types';

/**
 * A dynamic, stateless, button component that needs no re-rendering.
 * Mount and unmount only.
 * @param {function} func : a function for the button to perform on Click
 * @param {string} buttonName : a name for the button to display
 * @returns : a stateless JSX button
 */


const ControlButton = function(func, buttonName) {
    
    this.func = func();
    
    return(
        <>
            <button onClick = {this.func}>{buttonName}</button>
        </>
    );
    
}

ControlButton.propTypes = {
    functions: PropTypes.func.isRequired
};

export default ControlButton;
  