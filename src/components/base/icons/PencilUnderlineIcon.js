import React from 'react';

const PencilUnderlineIcon = ({ width = 0, color = '#fff' }) => {
  const widthValue = 19.377;
  const heightValue = 20.123;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      id="icon_pencil_underline"
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 19.377 20.123"
    >
      <path
        id="패스_20765"
        data-name="패스 20765"
        d="M5.077,5.076V2.538A2.538,2.538,0,0,0,0,2.538V5.076c0,.607,0,.7,0,1.269V17.133a.633.633,0,0,0,.127.38l1.9,2.538a.634.634,0,0,0,1.015,0l1.9-2.538a.632.632,0,0,0,.127-.38V5.076ZM1.27,2.538a1.269,1.269,0,0,1,2.538,0V5.076H1.269ZM3.807,16.921,2.538,18.613,1.269,16.921V6.345H3.808Z"
        transform="translate(10.153 0) rotate(30)"
        fill={color}
      />
      <path
        id="패스_20766"
        data-name="패스 20766"
        d="M.17,0h11V2.2H-1.686Z"
        transform="translate(8.205 16.667)"
        fill={color}
      />
    </svg>
  );
};

export default React.memo(PencilUnderlineIcon);
