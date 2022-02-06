import React from 'react';

export default React.memo(({ width = 0, color = '#fc0' }) => {
  const widthValue = 12.621;
  const heightValue = 12.025;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 12.621 12.025"
    >
      <path
        id="rate"
        d="M489.126,82.375c.155-.314.409-.314.564,0l1.482,3a1.36,1.36,0,0,0,.912.663l3.314.482c.346.05.425.291.174.536l-2.4,2.337a1.361,1.361,0,0,0-.349,1.072l.566,3.3c.059.345-.146.495-.456.332l-2.964-1.558a1.361,1.361,0,0,0-1.127,0L485.88,94.1c-.31.163-.515.013-.456-.332l.566-3.3a1.362,1.362,0,0,0-.349-1.072l-2.4-2.337c-.251-.245-.172-.486.174-.536l3.314-.482a1.359,1.359,0,0,0,.912-.663Z"
        transform="translate(-483.097 -82.139)"
        fill={color}
      />
    </svg>
  );
});
