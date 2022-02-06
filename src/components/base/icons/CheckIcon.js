import React from 'react';

const CheckIcon = ({ width = 0, color = '#fff' }) => {
  const widthValue = 11.121;
  const heightValue = 7.811;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 11.121 7.811"
    >
      <path
        id="icon_check"
        d="M0,3,3,6,9,0"
        transform="translate(1.061 1.061)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default React.memo(CheckIcon);
