import React from 'react';
import styled from 'styled-components';
import ErrorIcon from '@material-ui/icons/Error';
// import { icon_modal_alert } from 'components/base/images';
// import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
// import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
// import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

function CustomToastContent({ message }) {
  return (
    <Styled.CustomToastContent data-component-name="CustomToastContent">
      <ErrorIcon className="toastContent__icon_alert" />
      {message}.
    </Styled.CustomToastContent>
  );
}

const Styled = {
  CustomToastContent: styled.div`
    display: flex;
    align-items: center;
    padding: 8 10px;
    font-weight: 700;
    .toastContent__icon_alert {
      margin-right: 5px;
    }
  `,
};

export default CustomToastContent;
