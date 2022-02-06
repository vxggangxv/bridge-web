import React from 'react';

export default React.memo(({ width, color = '#00a6e2' }) => {
  const widthValue = 22;
  const heightValue = 20.761;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 22 20.761"
    >
      <g transform="translate(-104.773 -105.771)">
        <g transform="translate(104.773 105.771)">
          <path
            d="M125.034,105.877l-19.516,8.507a1.241,1.241,0,0,0-.073,2.241l3.958,2.043,11.791-8.2a.164.164,0,0,1,.259.131l-9.877,9.428a1.242,1.242,0,0,0-.384.9v4.366a1.241,1.241,0,0,0,2.3.647l2.4-3.921,5.07,2.617a1.242,1.242,0,0,0,1.775-.81l4-16.514A1.241,1.241,0,0,0,125.034,105.877Z"
            transform="translate(-104.773 -105.771)"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
});
