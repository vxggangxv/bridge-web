import React from 'react';

export default React.memo(({ width = 0, color = '#00a6e2' }) => {
  const widthValue = 13.032;
  const heightValue = 20.346;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 13.032 20.346"
    >
      <path d="M0,0H13.032V20.346l-6.62-4.792L0,20.346Z" fill={color} />
    </svg>
  );
});
