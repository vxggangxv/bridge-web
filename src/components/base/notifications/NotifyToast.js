import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

function NotifyToast(props) {
  return (
    <Styled.NotifyToast data-component-name="NotifyToast">
      <ToastContainer
        position="bottom-right"
        // autoClose={false}
        autoClose={2500}
        hideProgressBar
        // hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Styled.NotifyToast>
  );
}

const Styled = {
  NotifyToast: styled.div`
    .Toastify__toast {
    }
    .Toastify__toast-body {
    }
    .Toastify__close-button {
    }
  `,
};

export default NotifyToast;
