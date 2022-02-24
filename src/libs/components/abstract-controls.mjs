import React from 'react';
import PropTypes from 'prop-types';
import ControlButton from './buttons.mjs';

/**
 * A control panel component that dynamically generates buttons 
 * for a given array of functions/actions.
 * @property {array} functions: array of functions that will be 
 *    mapped to buttons
 * @returns {import('@babel/types').JSXElement}: a series of buttons 
 *    with onClick methods, bundled in a span element
 */

class Controls extends React.PureComponent {
  // render one button child comopnent for each function
  // each function bound to 'onClick' event handler
  constructor(props) {
    super(props);
  }

  render() {
    let funcList = this.props.functions.map((func) => {
        return <ControlButton func = {func} name = {}/>
    });
    // map a bunch of button components to each item in array
    return <span className='controls-component'>{funcList}</span>;
  }
}

Controls.propTypes = {
  functions: PropTypes.array.isRequired
};

export default Controls;
