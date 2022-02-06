import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import useInput from 'lib/hooks/useInput';
import styled from 'styled-components';
import { beforeDash, color, font } from 'styles/utils';
import _ from 'lodash';
import MuiButton from 'components/common/button/MuiButton';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import storage, { deleteCookie, getCookie, keys, setCookie, setSessionCookie } from 'lib/storage';
import { pageUrl } from 'lib/mapper';
import T from 'components/common/text/T';
import cx from 'classnames';
import { Trans } from 'react-i18next';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { useShallowSelector, useDidUpdateEffect } from 'lib/utils';
import queryString from 'query-string';
import { AppActions, AuthActions, UserActions } from 'store/actionCreators';
import { signOut } from 'store/modules/auth';

export default React.memo(function LegalUpdateContainer({ isOpenLegalPopup, accessToken }) {
  const { language, dofOauth2LegalUpdateSuccess } = useShallowSelector(state => ({
    language: state.base.language,
    dofOauth2LegalUpdateSuccess: state.auth.dofOauth2LegalUpdate.success,
  }));

  const location = useLocation();
  const history = useHistory();
  // const accessTokenValue = accessToken;
  const [accessTokenValue, setAccessTokenValue] = useState('');
  // const queryParse = queryString.parse(location.search);
  // const accessToken = queryParse?.accessToken;

  const policy_url = require(`static/files/legal/${language}/bridge_privacy.htm`);
  const terms_url = require(`static/files/legal/${language}/bridge_terms.htm`);

  const policy_check = useInput(false);
  const terms_check = useInput(false);

  useEffect(() => {
    // history.replace(location.pathname);
    // console.log('Accept accessToken ____________________ ', accessToken);
    setAccessTokenValue(accessToken);
  }, []);

  useDidUpdateEffect(() => {
    // console.log('Accept accessTokenValue ____________________ ', accessTokenValue);
    history.replace(location.pathname);
  }, [accessTokenValue]);

  useDidUpdateEffect(() => {
    if (dofOauth2LegalUpdateSuccess) {
      // console.log('Accept accessTokenValue ____________________ ', accessTokenValue);
      setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
      setSessionCookie(keys.sign_in_token, accessTokenValue);
      AuthActions.set_access_token(accessTokenValue);
      UserActions.fetch_profile_request();
      isOpenLegalPopup.setValue(false);
    }
  }, [dofOauth2LegalUpdateSuccess === true]);

  const handleSubmitAccept = () => {
    // [{"terms_type":"privacy", "is_agreement":1},
    // {"terms_type":"terms", "is_agreement":1}]

    let sevice_policy_arr = [
      {
        terms_type: 'privacy',
        is_agreement: 1,
      },
      {
        terms_type: 'terms',
        is_agreement: 1,
      },
    ];

    let submitData = {
      accessToken: accessTokenValue,
      policy: JSON.stringify(sevice_policy_arr),
    };

    // console.log('handleSubmitAccept _____________________ ', submitData);
    AuthActions.dof_oauth2_legal_request(submitData);
  };

  return (
    <LegalUpdate
      policy_url={policy_url}
      terms_url={terms_url}
      policy_check={policy_check}
      terms_check={terms_check}
      isOpenLegalPopup={isOpenLegalPopup}
      handleSubmitAccept={handleSubmitAccept}
    />
  );
});

export const LegalUpdate = React.memo(
  ({ policy_url, terms_url, policy_check, terms_check, isOpenLegalPopup, handleSubmitAccept }) => {
    const { t } = useTranslation();
    const history = useHistory();

    const handleRejectAgreement = () => {
      // history.push(pageUrl.legal.privacyPolicy);
      isOpenLegalPopup.setValue(false);
      signOut();
      AuthActions.sign_out_request();
      AppActions.remove_popups();
      AppActions.remove_toasts();
    };

    return (
      <Styled.LegalUpdate data-component-name="LegalUpdate">
        <div className="legalUpdate__container">
          <h3 className="legalUpdate__container_title page-title">
            <T>LEGAL_ACCEPT</T>
          </h3>
          <div className="legalUpdate__content_box policy">
            <div className="legalUpdate__content policy">
              <div className="legalUpdate__content_header_box">
                <Grid container className="legalUpdate__content_header_wrapper">
                  <Grid item xs={8} className="content_title">
                    <span>
                      <T>LEGAL_PRIVACY_POLICY</T>
                    </span>
                  </Grid>
                  <Grid item xs={4} className="legalUpdate__check_box_wrapper">
                    <label
                      className={cx('legalUpdate__radio_label', {
                        active: policy_check.value,
                      })}
                    >
                      <input
                        type="checkbox"
                        name="policy"
                        className="legalUpdate__checkbox_input"
                        value={policy_check.value}
                        checked={policy_check.value}
                        onChange={() => {
                          policy_check.onChange({ value: !policy_check.value });
                        }}
                      />
                      <span className="accept_checkmark visibility_checkmark">
                        <span className="accept_checkmark_in visibility_checkmark_in"></span>
                      </span>
                      <span className="accept_name">
                        <T>LEGAL_AGREE</T>
                      </span>
                    </label>
                  </Grid>
                </Grid>
              </div>
              <div className="legalUpdate__content_body_box">
                <iframe
                  id="legalAcceptPolicy"
                  className="legalUpdate__content_iframe"
                  src={policy_url}
                ></iframe>
              </div>
            </div>
          </div>
          <div className="legalUpdate__content_box terms">
            <div className="legalUpdate__content terms">
              <div className="legalUpdate__content_header_box">
                <Grid container className="legalUpdate__content_header_wrapper">
                  <Grid item xs={8} className="content_title">
                    <span>
                      <T>LEGAL_TERMS_OF_SERVICE</T>
                    </span>
                  </Grid>
                  <Grid item xs={4} className="legalUpdate__check_box_wrapper">
                    <label
                      className={cx('legalUpdate__radio_label', {
                        active: terms_check.value,
                      })}
                    >
                      <input
                        type="checkbox"
                        name="terms"
                        className="legalUpdate__checkbox_input"
                        value={terms_check.value}
                        checked={terms_check.value}
                        onChange={() => {
                          terms_check.onChange({ value: !terms_check.value });
                        }}
                      />
                      <span className="accept_checkmark visibility_checkmark">
                        <span className="accept_checkmark_in visibility_checkmark_in"></span>
                      </span>
                      <span className="accept_name">
                        <T>LEGAL_AGREE</T>
                      </span>
                    </label>
                  </Grid>
                </Grid>
              </div>
              <div className="legalUpdate__content_body_box">
                <iframe
                  id="legalAcceptTerms"
                  className="legalUpdate__content_iframe"
                  src={terms_url}
                ></iframe>
              </div>
            </div>
          </div>
          <div className="legalUpdate__content_button_box">
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              className="legal__container_option_btn cancel"
              onClick={handleRejectAgreement}
            >
              <T>GLOBAL_CANCEL</T>
            </MuiButton>
            <MuiButton
              disabled={policy_check.value && terms_check.value ? false : true}
              disableElevation
              variant="contained"
              color="primary"
              className="legal__container_option_btn"
              onClick={handleSubmitAccept}
              // onClick={() => {
              //   history.push(pageUrl.legal.privacyPolicy);
              // }}
            >
              <T>GLOBAL_ACCEPT</T>
            </MuiButton>
          </div>
        </div>
      </Styled.LegalUpdate>
    );
  },
);

const Styled = {
  LegalUpdate: styled.section`
    .legalUpdate__container_title {
      padding-top: 20px;
      &.page-title {
        ${beforeDash({})};
      }
    }
    .legalUpdate__container {
      /* width: 500px; */
      width: 100%;
      height: 860px;
      /* height: 500px; */
      background-color: #ffffff;
      .legalUpdate__content_box {
        padding: 30px;
        .legalUpdate__content {
          border: 1px solid #bababa;
          width: 100%;
          height: 300px;

          .legalUpdate__content_header_box {
            border-bottom: 1px solid #bababa;
            .legalUpdate__content_header_wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              .content_title {
                font-size: 22px;
                padding-left: 20px;
              }
            }
            .legalUpdate__check_box_wrapper {
              display: flex;
              justify-content: space-between;
              /* margin-bottom: 15px; */

              .legalUpdate__radio_label {
                height: 54px;
                position: relative;
                cursor: pointer;
                flex: 1;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 180px;
                /* height: 40px; */
                /* border: 1px solid #bbb; */
                border-left: 1px solid #bababa;
                box-sizing: border-box;
                /* border-radius: 4px; */
                text-align: center;
                font-size: 15px;
                color: #333333;
                &:not(:first-child) {
                  margin-left: 8px;
                }
                /* background-color: #bababa; */
                .accept_name {
                  font-weight: 700;
                  color: #bababa;
                }
                &.active {
                  background-color: #f6fafc;
                  /* background-color: ${color.blue}; */
                  /* border-color: ${color.blue}; */
                  .accept_checkmark {
                    /* background-color: ${color.blue}; */
                    .accept_checkmark_in {
                      border-left-color: ${color.blue};
                      border-bottom-color: ${color.blue};
                    }
                  }
                  .accept_name {
                    color: ${color.blue};
                  }
                }
                .legalUpdate__checkbox_input {
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 0;
                  width: 0;
                  overflow: hidden;
                  width: 20px;
                }
                .accept_checkmark {
                  position: absolute;
                  display: block;
                }
                .accept_checkmark {
                  width: 54px;
                  /* height: 54px; */
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  /* top: 50%; */
                  /* right: 9px; */
                  top: 20px;
                  left: 9px;
                  /* left: 0; */
                  transform: translateY(-50%);
                  /* height: 16px;
                  width: 16px; */
                  /* border-radius: 50%; */
                  /* background-color: #bbb; */
                  .accept_checkmark_in {
                    position: relative;
                    top: -2px;
                    display: block;
                    /* width: 8px;
                    height: 5px; */
                    width: 30px;
                    height: 20px;
                    border: 3px solid transparent;
                    border-left-color: #bababa;
                    border-bottom-color: #bababa;
                    /* border-left-color: ${color.blue};
                    border-bottom-color: ${color.blue}; */
                    transform: rotate(-45deg);
                  }
                }
              }
            }
          }
          .legalUpdate__content_body_box {
            .legalUpdate__content_iframe {
              width: 100%;
              height: 243px;
            }
          }
        }
      }

      .legalUpdate__content_button_box {
        /* text-align: center; */
        padding-top: 30px;
        display: flex;
        justify-content: center;
        /* margin-right: 65px; */
        .legal__container_option_btn {
          &.cancel {
            margin-right: 15px;
          }
        }
        .button {
          width: 115px;
        }
      }
    }
  `,
};
