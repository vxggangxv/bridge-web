import React from 'react';
import CustomSpan from 'components/common/text/CustomSpan';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import _ from 'lodash';
import MuiButton from 'components/common/button/MuiButton';
import { pageUrl } from 'lib/mapper';
import T from 'components/common/text/T';
import { NavLink } from 'react-router-dom';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import {
  howto_intro,
  howto_contact,
  howto_computer,
  howto_work_step_1,
  howto_work_step_2,
  howto_work_step_3,
  howto_work_step_4,
} from 'components/base/images';

export default React.memo(function HowToContainer(props) {
  return <HowTo />;
});

export const HowTo = React.memo(() => {
  return (
    <Styled.HowTo data-component-name="Howto">
      <h1 className="sr-only">Howto</h1>
      <div className="howto__container">
        {/* <------------------------------------------------------------------------------------------> */}
        <section className="howto__intro_container">
          <div className="howto__intro_background_wrapper">
            <div className="howto__intro main-layout">
              <h1 className="howto__intro_title">
                <T>HOWTO_INTRO</T>
              </h1>
              <p className="howto__intro_detail">
                <T>HOWTO_INTRO_DETAIL</T>
              </p>
              <p>
                <NavLink to={pageUrl.project.create}>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="secondary"
                    className="create_a_project_btn button_white"
                  >
                    <CustomSpan marginRight={20} fontSize={17} fontWeight={500}>
                      <T>HOWTO_CREATE_PROJECT</T>
                    </CustomSpan>
                    <div className="intro_button_end_icon">
                      <ArrowForwardIosRoundedIcon />
                    </div>
                  </MuiButton>
                </NavLink>
              </p>
            </div>
          </div>
        </section>
        {/* <------------------------------------------------------------------------------------------> */}
        <section className="howto__how_does_it_work_container main-layout">
          <div className="howto__how_does_it_work">
            <div className="howto__how_does_it_work_tag gradient_blue">
              <T>HOWTO_PROFESSIONAL</T>
            </div>
            <h1 className="howto__how_does_it_work_title section_title">
              <T>HOWTO_PROFESSIONAL_TITLE</T>
            </h1>
            <p className="howto__how_does_it_work_detail">
              <T>HOWTO_PROFESSIONAL_DETAIL</T>
            </p>

            <Grid container className="howto__how_does_it_work_step_container">
              <Grid item xs={3} className="howto__how_does_it_work_step_box create_a_project">
                <img src={howto_work_step_1} />
                <div className="howto__how_does_it_work_step">
                  <p>{'01.'}</p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_1_TITLE</T>
                  </p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_1_DETAIL</T>
                  </p>
                </div>
              </Grid>
              <Grid item xs={3} className="howto__how_does_it_work_step_box auto_start">
                <img src={howto_work_step_2} />
                <div className="howto__how_does_it_work_step">
                  <p>{'02.'}</p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_2_TITLE</T>
                  </p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_2_DETAIL</T>
                  </p>
                </div>
              </Grid>
              <Grid item xs={3} className="howto__how_does_it_work_step_box complete_payment">
                <img src={howto_work_step_3} />
                <div className="howto__how_does_it_work_step">
                  <p>{'03.'}</p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_3_TITLE</T>
                  </p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_3_DETAIL</T>
                  </p>
                </div>
              </Grid>
              <Grid item xs={3} className="howto__how_does_it_work_step_box design_download">
                <img src={howto_work_step_4} />
                <div className="howto__how_does_it_work_step">
                  <p>{'04.'}</p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_4_TITLE</T>
                  </p>
                  <p>
                    <T>HOWTO_PROFESSIONAL_STEP_4_DETAIL</T>
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        {/* <------------------------------------------------------------------------------------------> */}
        <div className="partition_line main-layout"></div>
        {/* <------------------------------------------------------------------------------------------> */}
        <section className="howto__be_in_control_container main-layout">
          <Grid container className="howto__be_in_control">
            <Grid item xs={6} className="howto__be_in_control_image_box">
              <img src={howto_contact} />
            </Grid>
            <Grid item xs={6} className="howto__be_in_control_contant_box">
              <div className="howto__be_in_control_tag gradient_blue">
                <T>HOWTO_EFFICIENCY</T>
              </div>
              <div className="howto__be_in_control_title_box title">
                <h1 className="howto__be_in_control_title section_title">
                  <T>HOWTO_EFFICIENCY_TITLE</T>
                </h1>
                <p>
                  <T>HOWTO_EFFICIENCY_DETAIL</T>
                </p>
              </div>
              <div className="howto__be_in_control_text_box live_chat">
                <p className="howto__be_in_control_text_title">
                  <T>HOWTO_EFFICIENCY_LIVE_CHAT</T>
                </p>
                <p className="howto__be_in_control_text_detail">
                  <T>HOWTO_EFFICIENCY_LIVE_CHAT_DETAIL</T>
                </p>
              </div>
              <div className="howto__be_in_control_text_box monitoring">
                <p className="howto__be_in_control_text_title">
                  <T>HOWTO_EFFICIENCY_MONITORING</T>
                </p>
                <p className="howto__be_in_control_text_detail">
                  <T>HOWTO_EFFICIENCY_MONITORING_DETAIL</T>
                </p>
              </div>
              <div className="howto__be_in_control_text_box design_edit">
                <p className="howto__be_in_control_text_title">
                  <T>HOWTO_EFFICIENCY_DESIGN_EDIT</T>
                </p>
                <p className="howto__be_in_control_text_detail">
                  <T>HOWTO_EFFICIENCY_DESIGN_EDIT_DETAIL</T>
                </p>
              </div>
            </Grid>
          </Grid>
        </section>
        {/* <------------------------------------------------------------------------------------------> */}
        <section className="howto__safely_trading_system_container">
          <div className="howto__safely_trading_system main-layout">
            <div className="howto__safely_trading_system_tag gradient_blue"></div>
            <div className="howto__safely_trading_system_safe_tag gradient_blue">
              <T>HOWTO_SAFE</T>
            </div>
            <h1 className="howto__safely_trading_system_title section_title">
              <T>HOWTO_SEFELY_TITLE</T>
            </h1>

            <div className="howto__safely_trading_system_detail">
              <p>
                <T>HOWTO_SEFELY_DETAIL</T>
              </p>
              <p>
                <T>HOWTO_SEFELY_DETAIL_STEP</T>
              </p>
            </div>
            <div className="howto__safely_trading_system_image">
              <img src={howto_computer} />
            </div>
          </div>
        </section>
        {/* <------------------------------------------------------------------------------------------> */}
        <section className="howto__opportunity_to_collaborate_container main-layout">
          <div className="howto__opportunity_to_collaborate ">
            <div className="howto__opportunity_to_collaborate_tag gradient_blue"></div>
            <h1 className="howto__opportunity_to_collaborate_title section_title">
              <T>HOWTO_COLLABORATE_TITLE</T>
            </h1>
            <p className="howto__opportunity_to_collaborate_detail">
              <T>HOWTO_COLLABORATE_DETAIL</T>
            </p>
            <p className="howto__opportunity_to_collaborate_button">
              <NavLink to={pageUrl.project.create}>
                <MuiButton
                  disableElevation
                  variant="contained"
                  color="secondary"
                  className="create_a_project_btn gradient_blue"
                >
                  <CustomSpan marginRight={20} fontSize={17} fontWeight={500}>
                    <T>HOWTO_CREATE_PROJECT</T>
                  </CustomSpan>
                  <div className="intro_button_end_icon">
                    <ArrowForwardIosRoundedIcon />
                  </div>
                </MuiButton>
              </NavLink>
            </p>
          </div>
        </section>
      </div>
    </Styled.HowTo>
  );
});

const Styled = {
  HowTo: styled.section`
    word-break: break-all;
    white-space: pre;
    .gradient_blue {
      background: linear-gradient(to right, rgba(0, 166, 226, 1), rgba(8, 123, 238, 1));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .button_white {
      background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00155e;
    }
    .section_title {
      font-size: 41px;
      font-weight: 800;
      color: #00155e;
    }
    .create_a_project_btn {
      align-items: center;
      justify-content: flex-end;
      font-size: 17px;
      font-weight: 500;
      width: 250px;
      height: 45px;
      border: none;
      border-radius: 23px;
      padding: 0;
      .intro_button_end_icon {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    /************************* section 1 start *************************/
    .howto__intro_container {
      .howto__intro_background_wrapper {
        width: 100%;
        height: 665px;
        overflow: hidden;
        background-image: url(${howto_intro});
        background-repeat: no-repeat;
        background-size: cover;

        .howto__intro {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 40px;
          color: #ffffff;
          .howto__intro_title {
            line-height: 70px;
            font-size: 52px;
            font-weight: 800;
            margin-bottom: 17px;
          }
          .howto__intro_detail {
            line-height: 32px;
            font-size: 19px;
            font-weight: 400;
            margin-bottom: 70px;
          }
        }
      }
    }
    /************************* section 1 end *************************/
    /************************* section 2 start *************************/
    .howto__how_does_it_work_container {
      .howto__how_does_it_work {
        width: 100%;
        padding: 60px 40px 105px 40px;
        .howto__how_does_it_work_tag {
          width: 125px;
          height: 35px;
          border-radius: 26px;
          font-weight: 500;
          margin-bottom: 35px;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
        }

        .howto__how_does_it_work_title {
          line-height: 54px;
          margin-bottom: 19px;
        }
        .howto__how_does_it_work_detail {
          line-height: 26px;
          margin-bottom: 95px;
          font-size: 20px;
          font-weight: 400;
          color: #b5b7c1;
        }
        .howto__how_does_it_work_step_container {
          .howto__how_does_it_work_step_box {
            .howto__how_does_it_work_step {
              text-align: center;
              p {
                &:nth-child(1) {
                  font-size: 30px;
                  font-weight: 800;
                  color: #00155e;
                  margin-top: 16px;
                  margin-bottom: 14px;
                }
                &:nth-child(2) {
                  font-size: 22px;
                  font-weight: 800;
                  color: #00155e;
                  margin-bottom: 19px;
                }
                &:nth-child(3) {
                  font-size: 15px;
                  font-weight: 400;
                  line-height: 28px;
                  color: #5e5e5e;
                }
              }
            }
          }
        }
      }
    }
    /************************* section 2 end *************************/
    .partition_line {
      height: 5px;
      background-color: #f8f9fb;
    }
    /************************* section 3 start *************************/
    .howto__be_in_control_container {
      padding: 100px 0 105px;
      .howto__be_in_control_image_box {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .howto__be_in_control_contant_box {
        .howto__be_in_control_tag {
          width: 125px;
          height: 35px;
          border-radius: 26px;
          font-weight: 500;
          margin-bottom: 35px;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
        }
        .howto__be_in_control_title_box {
          margin-bottom: 68px;
          .howto__be_in_control_title {
            margin-bottom: 29px;
            line-height: 60px;
          }
          p {
            font-size: 20px;
            font-weight: 400;
            color: #b5b7c1;
            line-height: 37px;
          }
        }
        .howto__be_in_control_text_box {
          &.live_chat {
            margin-bottom: 31px;
          }
          &.design_edit {
            margin-top: 31px;
          }
          .howto__be_in_control_text_title {
            font-size: 20px;
            font-weight: 800;
            color: #00155e;
            margin-bottom: 10px;
          }
          .howto__be_in_control_text_detail {
            font-size: 15px;
            font-weight: 400;
            color: #5e5e5e;
            line-height: 22px;
          }
        }
      }
    }
    /************************* section 3 end *************************/
    /************************* section 4 start *************************/
    .howto__safely_trading_system_container {
      padding-top: 100px;
      background-color: #f5fcff;
      .howto__safely_trading_system {
        text-align: center;
        .howto__safely_trading_system_tag {
          width: 125px;
          height: 5px;
          margin: 0 auto;
        }
        .howto__safely_trading_system_safe_tag {
          width: 125px;
          height: 35px;
          border-radius: 26px;
          font-weight: 500;
          margin-bottom: 35px;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          margin: 25px auto 33px;
        }
        .howto__safely_trading_system_title {
          line-height: 60px;
          margin-bottom: 48px;
        }
        .howto__safely_trading_system_detail {
          margin-bottom: 89px;
          p {
            line-height: 37px;
            font-size: 20px;
            font-weight: 400;
            color: #b5b7c1;
            &:nth-child(1) {
              margin-bottom: 40px;
            }
          }
        }
        .howto__safely_trading_system_image {
        }
      }
    }
    /************************* section 4 end *************************/
    /************************* section 5 start *************************/
    .howto__opportunity_to_collaborate_container {
      padding: 100px 0 150px;
      .howto__opportunity_to_collaborate {
        text-align: center;
        .howto__opportunity_to_collaborate_tag {
          width: 125px;
          height: 5px;
          margin: 0 auto 35px auto;
        }
        .howto__opportunity_to_collaborate_title {
          line-height: 60px;
          margin-bottom: 44px;
        }
        .howto__opportunity_to_collaborate_detail {
          line-height: 37px;
          font-size: 20px;
          font-weight: 400;
          color: #b5b7c1;
          margin-bottom: 44px;
        }
        .howto__opportunity_to_collaborate_button {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    /************************* section 5 end *************************/
  `,
};
