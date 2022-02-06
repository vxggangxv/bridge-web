import React from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import {
  logo_footer_white,
  icon_facebook,
  icon_instagram,
  icon_linkedin,
  icon_youtube,
} from 'components/base/images';
import T from 'components/common/text/T';
import TermsOfUseInfo from 'components/base/terms/TermsOfUseInfo';

function AppFooter({ leftBgColor, rightBgColor, rightFontColor, hasCenterBar }) {
  return (
    <Styled.AppFooter
      data-component-name="AppFooter"
      leftBgColor={leftBgColor}
      rightBgColor={rightBgColor}
      rightFontColor={rightFontColor}
      hasCenterBar={hasCenterBar}
    >
      <footer className="footer">
        <div className="footer__background_wrapper">
          <div className="footer__background left"></div>
          <div className="footer__background right"></div>
        </div>
        <div className="footer__main_wrapper">
          <div className="footer__main main-layout">
            <section className="footer__main_content left">
              <div className="footer__logo_box">
                <img className="footer__logo" src={logo_footer_white} />
              </div>
              <div className="footer__main_content_in">
                <p>
                  <T>FOOTER_LEFT_CONTENT</T>
                </p>
                <p className="contact_us">
                  <T>FOOTER_LEFT_CONTACT_US</T>
                </p>
                <div className="footer__sns_box">
                  <div className="footer__sns_icon_wrapper facebook">
                    <a href="https://www.facebook.com/doflab/" target="_blank">
                      <img className="footer__sns_icon" src={icon_facebook} />
                    </a>
                  </div>
                  <div className="footer__sns_icon_wrapper instagram">
                    <a href="https://www.instagram.com/dof_inc/" target="_blank">
                      <img className="footer__sns_icon" src={icon_instagram} />
                    </a>
                  </div>
                  <div className="footer__sns_icon_wrapper linkedin">
                    <a href="https://www.linkedin.com/company/dof-inc." target="_blank">
                      <img className="footer__sns_icon" src={icon_linkedin} />
                    </a>
                  </div>
                  <div className="footer__sns_icon_wrapper youtube">
                    <a href="https://www.youtube.com/c/DOFinc" target="_blank">
                      <img className="footer__sns_icon" src={icon_youtube} />
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section className="footer__main_content centerbar"></section>
            <section className="footer__main_content right">
              <div className="footer__main_content_in">
                <p>
                  <T>FOOTER_RIGHT_CONTENT</T>
                </p>
                <p>
                  <T>FOOTER_RIGHT_ADDRESS</T>
                </p>
                <p>
                  <T>FOOTER_RIGHT_BUSINESS_REG</T>
                </p>
                <p>
                  <T>FOOTER_RIGHT_TELECOMMUNICATION</T>{' '}
                  <span>
                    <T>FOOTER_CEO_NAME</T>
                  </span>
                </p>
                <TermsOfUseInfo location="footer" rightFontColor={rightFontColor} />
                {/* <p className="policy_box">
                  <a className="footer_terms_service underline" href="#" target="_blank">
                    <T>TERMS_OF_SERVICE</T>
                  </a>
                  /
                  <a className="footer_privacy_policy underline" href="#" target="_blank">
                    <T>PRIVACY_POLICY</T>
                  </a>
                </p> */}
              </div>
            </section>
          </div>
        </div>
      </footer>
    </Styled.AppFooter>
  );
}

const Styled = {
  AppFooter: styled.footer`
    .left,
    .right {
      width: 50%;
      height: 100%;
    }

    .footer {
      position: relative;
      width: 100%;
      padding: 0;
      height: 200px;

      .footer__background_wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        .footer__background {
          position: absolute;
          &.left {
            left: 0;
            /* background-color: #0d176c; */
            background-color: ${({ leftBgColor }) =>
              !!leftBgColor ? leftBgColor : color.navy_blue};
          }
          &.right {
            right: 0;
            /* background-color: #fff; */
            background-color: ${({ rightBgColor }) =>
              !!rightBgColor ? rightBgColor : color.navy_blue};
          }
        }
      }

      .footer__main_wrapper {
        /* background-color: ${color.navy_blue}; */

        .footer__main {
          padding-top: 35px;
          background-color: transparent;
          display: flex;
          .footer__main_content {
            .footer__logo_box {
              margin-top: 13px;
              margin-right: 40px;

              .footer__logo {
                width: 95px;
              }
            }

            &.left {
              display: flex;
              p {
                font-size: 12px;
                line-height: 30px;
              }
            }
            &.right {
              p {
                font-size: 12px;
                line-height: 23px;
              }
            }
            &.centerbar {
              display: ${({ hasCenterBar }) => hasCenterBar === false && 'none'};
              width: 1px;
              height: 135px;
              background-color: #ffffff;
            }
          }
          .left {
            color: #ffffff;
          }
          .right {
            /* color: #1c1c1c; */
            color: ${({ rightFontColor }) => (!!rightFontColor ? rightFontColor : '#bbbbbb')};
            padding-left: 35px;
            .policy_box {
              color: ${({ rightFontColor }) => (!!rightFontColor ? rightFontColor : '#ffffff')};
            }
          }
        }
        .footer__main_content_in {
          /* .policy_box {
            padding-top: 15px;
          }
          .underline {
            text-decoration: underline;
          }
          .footer_terms_service {
            margin-right: 15px;
          }
          .footer_privacy_policy {
            margin-left: 15px;
          } */
        }
      }
      .footer__sns_box {
        display: flex;
        padding-top: 30px;
        .footer__sns_icon_wrapper {
          padding-right: 20px;
          .footer__sns_icon {
            width: 38px;
          }
        }
      }
    }
  `,
};

export default AppFooter;
