import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { pageUrl } from 'lib/mapper';

export default React.memo(function PaymentContainer(props) {
  const { pathname } = useLocation();
  const lastUrl = pathname.split('/').pop();
  const history = useHistory();

  useEffect(() => {
    if (lastUrl === 'success') {
      window.opener.postMessage({ result: 'success' }, '*');
      // window.self.close();
    } else if (lastUrl === 'cashreceipt') {
      // cashreceipt error인한 현금영수증 failure 처리
      window.opener.postMessage({ result: 'failure' }, '*');
      // window.self.close();
    } else if (lastUrl === 'paymentTestPopupUrl') {
      // 팝업 test용 url
      // window.opener.postMessage({ result: 'failure' }, '*');
      // window.self.close();
    } else {
      window.opener.postMessage({ result: 'failure' }, '*');
      // window.self.close();
    }
  }, [lastUrl]);

  const handleHistoryPush = data => {
    console.log('Click Action : ', `${data}`);
    history.push(`/payment/payletter/return/${data}`);
  };

  return (
    <Styled.PaymentContainer>
      {lastUrl === 'paymentTestPopupUrl' && (
        <>
          <div
            onClick={() => {
              handleHistoryPush('cancel');
            }}
          >
            cancel
          </div>
          <div
            onClick={() => {
              handleHistoryPush('success');
            }}
          >
            success
          </div>
        </>
      )}
    </Styled.PaymentContainer>
  );
});
const Styled = {
  PaymentContainer: styled.section``,
};
