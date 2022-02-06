import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import { color } from '../../styles/utils';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import CustomSpan from 'components/common/text/CustomSpan';

export default function MainNotice({ onClick = () => {} }) {
  return (
    <StyledMainNotice className="flex-center">
      <div className="mainNotice__container">
        <div className="mainNotice__header flex-center">
          <h2>Notice</h2>
          {/* <button className="btn-reset flex-center" onClick={onClick}>
            <CloseIcon htmlColor="white" fontSize="inherit" className="modal__close_icon" />
          </button> */}
        </div>
        <div className="mainNotice__body">
          <div className="mainNotice__content">
            <h3>
              <span>Update</span>
            </h3>
            <p className="mainNotice__update_text">
              We are writing to notify you of a scheduled server
              <br />
              maintenance and update for improving customer
              <br />
              service for the following date and time:
              <br />
            </p>

            <div className="mainNotice__info">
              <p>
                <span>Date</span>
                2021.12.23(Thu) 11:00~15:00 (KST)
              </p>
              <p>
                <span>Work</span>
                Server update
              </p>
              <p>
                <span>Restricted</span>
                Access the site, Create a new order
              </p>
            </div>
            <p className="mainNotice__comment">
              We apologize for the inconvenience.
              <br />
              <CustomSpan fontSize={14}>(It may end earlier than planned.)</CustomSpan>
            </p>
            {/* <div>
              <FormControlLabel
                control={
                  <MuiWrapper>
                    <Checkbox
                      checked={autoLogin.value}
                      color="primary"
                      size="small"
                      onChange={e => autoLogin.setValue(e.target.checked)}
                      className="auto__check"
                    />
                  </MuiWrapper>
                }
                label={
                  <span className="mainNotice__checkbox_day">
                    Don't open pop-ups for a day.
                  </span>
                }
                labelPlacement="end"
              />
            </div> */}
          </div>
        </div>
        <div className="mainNotice__footer">
          <button className="btn-reset mainNotice__ok_btn" onClick={onClick}>
            OK
          </button>
        </div>
      </div>
    </StyledMainNotice>
  );
}

const StyledMainNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.23);

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mainNotice__container {
    position: relative;
    margin: 0 auto;
    width: 570px;
    background-color: ${color.navy_blue};
    border-radius: 10px;
  }
  .mainNotice__header {
    padding: 15px;
    h2 {
      font-size: 20px;
      color: white;
      font-weight: 700;
    }
    button {
      position: absolute;
      right: 15px;
      width: 20px;
      height: 20px;
      border: 1px solid white;
      border-radius: 50%;
      font-size: 12px;
      line-height: 0;
    }
  }
  .mainNotice__body {
    padding: 0 15px;
    .mainNotice__content {
      padding: 30px 0 60px;
      background-color: white;
      border-radius: 10px;
      text-align: center;
      font-size: 18px;
      h3 {
        font-size: 22px;
        font-weight: 700;
        span {
          padding: 10px 0;
          border-bottom: 2px solid ${color.blue};
        }
      }
      .mainNotice__update_text {
        margin-top: 30px;
        line-height: 1.5;
        font-weight: 700;
      }
      .mainNotice__info {
        width: 450px;
        margin: 0 auto;
        margin-top: 30px;
        padding: 30px 35px;
        background-color: #f5fcff;
        border-radius: 5px;
        text-align: left;
        font-size: 15px;
        p {
          &:not(:first-child) {
            margin-top: 15px;
          }
        }
        span {
          display: inline-block;
          margin-right: 15px;
          width: 80px;
          border-right: 1px solid ${color.black_font};
        }
      }
      .mainNotice__comment {
        margin-top: 20px;
        font-weight: 700;
      }
    }
  }
  .mainNotice__footer {
    .mainNotice__ok_btn {
      display: block;
      margin: 0 auto;
      margin-top: -30px;
      width: 320px;
      height: 60px;
      background-color: #a6a8b1;
      border: 10px solid ${color.navy_blue};
      border-radius: 35px;
      color: white;
      /* cursor: pointer; */
      /* &:hover {
        background-color: ${color.blue};
      } */
    }
  }
`;
