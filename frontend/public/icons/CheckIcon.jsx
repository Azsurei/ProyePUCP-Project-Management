import React from "react";

export const CheckIcon = ({size = 24, width, height, ...props}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path
        d="M6.735 12.322a1 1 0 00-1.47 1.356l3.612 3.92c.537.525 1.337.525 1.834.03l.364-.36c1.314-1.292 2.627-2.587 3.939-3.883l.04-.04a492.901 492.901 0 003.658-3.643 1 1 0 00-1.424-1.404 519.649 519.649 0 01-3.64 3.625l-.04.04a2031.836 2031.836 0 01-3.775 3.722l-3.098-3.363z"
        fill="#44546F"
      />
    </g>
  </svg>
);

