import React from 'react';
import styled from 'styled-components';
import { _color } from 'styles/_variables';
import CheckIcon from 'components/base/icons/CheckIcon';
import cx from 'classnames';

// input기능을 사용시 label로 감싸서 사용
const CustomCheckbox = ({
  width = 20,
  color = _color.blue,
  borderColor = _color.gray_b5,
  checked = false,
  marginLeft = 0,
  marginRight = 5,
  defaultChecked = false, // 기본 checkIcon이 보이는지 설정
  type = 'checkbox', // type: checkbox, radio
  name = '',
  disabled = false,
  onChange = e => {},
}) => {
  return (
    <Styled.CustomCheckbox
      data-component-name="CustomCheckbox"
      className={cx({ active: checked })}
      width={width}
      color={color}
      borderColor={borderColor}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      {defaultChecked && <CheckIcon color={checked ? 'white' : '#b5b7c1'} />}
      {!defaultChecked && <CheckIcon color={checked ? 'white' : 'transparent'} />}
      {/* hidden input */}
      {type === 'checkbox' && (
        <input
          hidden
          type="checkbox"
          name={name}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />
      )}
      {type === 'radio' && (
        <input
          hidden
          type="radio"
          name={name}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />
      )}
    </Styled.CustomCheckbox>
  );
};

const Styled = {
  CustomCheckbox: styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: ${({ marginLeft }) => marginLeft && marginLeft}px;
    margin-right: ${({ marginRight }) => marginRight && marginRight}px;
    width: ${({ width }) => width + 'px'};
    height: ${({ width }) => width + 'px'};
    border: 1px solid ${({ borderColor }) => borderColor};
    border-radius: 3px;
    color: #b5b7c1;
    &.active {
      background-color: ${({ color }) => color};
      border-color: transparent;
      color: white;
    }
  `,
};

export default React.memo(CustomCheckbox);
