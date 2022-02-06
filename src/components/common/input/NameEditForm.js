import React from 'react';
import styled from 'styled-components';

export default function NameEditForm(props) {
  return (
    <Styled.NameEditForm data-component-name="NameEditForm">
      <div className="box">
        <span className="text"></span>
      </div>
    </Styled.NameEditForm>
  );
}

const Styled = {
  NameEditForm: styled.div`
    .box {
    }
    .text {
    }
  `,
};

const Container = styled.div`
  border: 1px solid #ddd;
`;
const Text = styled.span`
  font-weight: 700;
  color: #fff;
`;

export default function NameEditForm(props) {
  return (
    <Container>
      <Text>HiHi</Text>
    </Container>
  );
}
