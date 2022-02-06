import React from 'react';

export default React.memo(({ width = 0, color = '#fc0' }) => {
  const widthValue = 11.033;
  const heightValue = 9.503;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 11.033 9.503"
    >
      <g transform="translate(0 0)">
        <path
          d="M275.028,308.061a2.887,2.887,0,0,0-5.517-1.19,2.885,2.885,0,1,0-4.494,3.392l4.4,4.374a.138.138,0,0,0,.1.041.139.139,0,0,0,.1-.041l4.567-4.537h0a2.874,2.874,0,0,0,.844-2.037Z"
          transform="translate(-263.995 -305.174)"
          fill={color}
        />
      </g>
    </svg>
  );
});
