import React from 'react';
const icon = require('static/images/icons/icon_eye.svg');

export default function Icons({ children, src }) {
  // const Component = () => component;
  // console.log(Component, 'Component');
  console.log(children, 'children');
  console.log(icon, 'icon');
  return (
    <>
      test
      {children}
      {src}
      {icon}
      {/* <Component src={src} /> */}
    </>
  );
}
