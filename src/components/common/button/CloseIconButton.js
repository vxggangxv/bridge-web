import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router';

export const CloseIconButton = ({ onCancel = () => {}, cancelLink = '' }) => {
  const history = useHistory();

  return (
    <StyledCloseIconButton
      data-component-name="CloseIconButton"
      className="flex-center cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        onCancel();
        if (cancelLink) history.push(cancelLink);
      }}
    >
      <CloseIcon htmlColor="white" fontSize="inherit" className="modal__close_icon" />
    </StyledCloseIconButton>
  );
};

export default React.memo(CloseIconButton);

const StyledCloseIconButton = styled.span`
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: 1px solid white;
  border-radius: 50%;
  font-size: 16px;
`;
