import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, text, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    style={{ backgroundColor: 'white', fontSize: '1.2rem', color: 'black' }}
  >
    {text}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  type: 'button',
};

export default Button;