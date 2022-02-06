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

function AppFooter(props) {
  const { lbackColor, rbackColor, rfontColor, isCenterBar } = props;

  return (
    <Styled.AppFooter
      data-component-name="AppFooter"
      lbackColor={lbackColor}
      rbackColor={rbackColor}
      rfontColor={rfontColor}
      isCenterBar={isCenterBar}
    >
      <footer className="footer">
        <div className="footer__background_wrapper">
          <section className="footer__background left"></section>
          <section className="footer__background right"></section>
        </div>
        <div className="footer__main_wrapper">
          <div className="footer__main main-layout">
            <section className="footer__main_content left">
              <div className="footer__logo_box">
                <img className="footer__logo" src={logo_footer_white} />
              </div>
              <div className="footer__main_content_box">
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
              <div className="footer__main_content_box">
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
                <TermsOfUseInfo location="footer" rfontColor={rfontColor} />
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
    .left {
      width: 50%;
      height: 100%;
    }
    .right {
      width: 50%;
      height: 100%;
    }

    .footer {
      position: absolute;
      width: 100%;
      padding: 0;
      height: 220px;
      .footer__background_wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        .footer__background {
          &.left {
            /* background-color: #0d176c; */
            background-color: ${({ lbackColor }) => (!!lbackColor ? lbackColor : '#17288b')};
          }
          &.right {
            /* background-color: #fff; */
            background-color: ${({ rbackColor }) => (!!rbackColor ? rbackColor : '#17288b')};
          }
        }
      }

      .footer__main_wrapper {
        position: absolute;
        width: 100%;
        padding: 0;
        height: 220px;
        top: 0;
        left: 0;

        .footer__main {
          padding-top: 35px;
          background-color: transparent;
          height: 220px;
          display: flex;
          .footer__main_content {
            .footer__logo {
              width: 95px;
              margin-right: 60px;
            }
            &.left {
              display: flex;
              p {
                line-height: 30px;
              }
            }
            &.right {
              p {
                line-height: 25px;
              }
            }
            &.centerbar {
              display: ${({ isCenterBar }) => isCenterBar === false && 'none'};
              width: 1px;
              height: 145px;
              background-color: #ffffff;
            }
          }
          .left {
            color: #ffffff;
          }
          .right {
            /* color: #1c1c1c; */
            color: ${({ rfontColor }) => (!!rfontColor ? rfontColor : '#bbbbbb')};
            padding-left: 35px;
            .policy_box {
              color: ${({ rfontColor }) => (!!rfontColor ? rfontColor : '#ffffff')};
            }
          }
        }
        .footer__main_content_box {
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
