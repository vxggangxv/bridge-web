import CustomTitle from 'components/common/text/CustomTitle';
import React from 'react';
import styled from 'styled-components';

export default function InvoiceContainer(props) {
  return <Invoice />;
}

export function Invoice(props) {
  return (
    <Styled.Invoice data-component-name="Invoice">
      <div className="sub-layout">
        <CustomTitle fontSize={30} marginTop={80} marginBottom={80} fontWeight={700}>
          Refund points
        </CustomTitle>
      </div>
    </Styled.Invoice>
  );
}

const Styled = {
  Invoice: styled.div``,
};
