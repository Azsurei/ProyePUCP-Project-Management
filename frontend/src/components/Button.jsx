import React from 'react';
import Link from 'next/link'
import '@/styles/Button.css';

function Button({ href, text }) {
    return (
        <Link href={href}>
            <button className="button" type="button">
              {text}
            </button>
        </Link>
    );
}

export default Button;