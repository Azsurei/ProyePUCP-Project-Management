import React from 'react';
import Link from 'next/link';

const Button = ({ type, text, href }) => (
  <Link href={href}>
    <button
      type={type}
      style={{ 
        backgroundColor: 'white', 
        fontSize: '1.2rem', 
        color: 'black' 
      }}
    >
      {text}
    </button>
  </Link>
);

export default Button;