import React from 'react';
import styled from 'styled-components';
import { Slider } from '@material-ui/core';
import { color } from 'styles/utils';
import PropTypes from 'prop-types';

const UnitSlider = ({
  data,
  step = 0.01,
  defaultValue = 0,
  min,
  max,
  digit = 5,
  valueVisible = true,
  disabled = false,
  ariaLabelledby = '',
  width = '100%',
}) => {
  if (!data) return null;
  return (
    <StyledUnitSlider data-component-name="UnitSlider" width={width}>
      <Slider
        disabled={disabled}
        defaultValue={defaultValue}
        aria-labelledby={ariaLabelledby}
        value={Number(data.value)}
        // getAriaValueText={() => Number(data.value).toFixed(2)}
        onChange={(e, newVal) => data.setValue(newVal)}
        valueLabelDisplay="auto"
        step={step}
        marks
        min={min}
        max={max}
        className="unitSlider"
      />
      {valueVisible && (
        <input
          // value={
          //   data.value !== '-'
          //     ? Number(data.value).toFixed(2)
          //     : data.value
          // }
          value={
            String(data.value)?.includes('-')
              ? String(data.value).slice(0, digit)
              : String(data.value).slice(0, digit - 1)
          }
          onChange={data.onChange}
          className="input-reset unitSlider__value"
          onBlur={() => {
            if (data.value === '' || isNaN(data.value)) {
              return data.setValue(defaultValue);
            } else {
              if (data.value < min) return data.setValue(min);
              if (data.value > max) return data.setValue(max);
              // return data.setValue(draft => Number(draft).toFixed(2));
            }
          }}
        />
      )}
      {/* <span className="unitSlider__value">{data.value}</span> */}
    </StyledUnitSlider>
  );
};

UnitSlider.propTypes = {
  data: PropTypes.object.isRequired,
  step: PropTypes.number,
  defaultValue: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  digit: PropTypes.number,
  valueVisible: PropTypes.bool,
  disabled: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default React.memo(UnitSlider);

const StyledUnitSlider = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
  width: ${({ width }) => (width && typeof width === 'string' ? width : width && width + 'px')};
  .unitSlider {
    width: calc(100% - 55px);
    color: ${color.blue};
    &:after,
    &:before {
      content: '';
      display: inline-block;
      z-index: 1;
      position: absolute;
      margin-top: -3px;
      width: 8px;
      height: 8px;
      background-color: ${color.blue};
      border-radius: 50%;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: -2px;
    }
    .MuiSlider-thumb {
      z-index: 2;
      width: 16px;
      height: 16px;
      background-color: white;
      border: 4px solid ${color.blue};
      margin-top: -7px;
      margin-left: -8px;
      .MuiSlider-valueLabel {
        left: calc(-50% - 8px);
      }
    }
    &.Mui-disabled {
      &:after,
      &:before {
        background-color: ${color.gray_b5};
      }
      .MuiSlider-thumb {
        border-color: ${color.gray_b5};
      }
    }
  }
  .unitSlider__value {
    width: 45px;
    margin-left: 10px;
    /* margin-top: -2px; */
    /* padding-bottom: 2px; */
    /* border-bottom: 1px solid ${color.gray_font}; */
    padding: 4px 0;
    background-color: #f4f5fa;
    border-radius: 5px;
    text-align: center;
    font-size: 13px;
  }
`;
