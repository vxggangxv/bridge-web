import React from 'react';

const DownloadIcon = ({ width = 0, color = '#17288a' }) => {
  const widthValue = 23.177;
  const heightValue = 19.203;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 23.177 19.203"
    >
      <g id="icon_download" transform="translate(23.177) rotate(90)">
        <g id="group_670" data-name="group 670" transform="translate(14.721 17.05) rotate(180)">
          <g id="group_668" data-name="group 668" transform="translate(1.574 4.432)">
            <rect
              id="사각형_521"
              data-name="사각형 521"
              width="13.148"
              height="2.226"
              fill={color}
            />
          </g>
          <g id="group_669" data-name="group 669" transform="translate(0 0)">
            <path
              id="패스_1373"
              data-name="패스 1373"
              d="M7.119,1.574,3.147,5.545,7.119,9.517,5.545,11.091,0,5.545,5.545,0Z"
              fill={color}
            />
          </g>
        </g>
        <g id="group_671" data-name="group 671" transform="translate(11.4 0)">
          <path
            id="패스_1374"
            data-name="패스 1374"
            d="M7.8,0V23.177H0V20.862H5.489V2.314H0V0Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export default React.memo(DownloadIcon);
