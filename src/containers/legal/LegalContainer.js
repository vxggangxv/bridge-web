import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import styled from 'styled-components';
import { beforeDash } from 'styles/utils';
import _ from 'lodash';
import MuiButton from 'components/common/button/MuiButton';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import T from 'components/common/text/T';
import { Trans } from 'react-i18next';
import { useShallowSelector } from 'lib/utils';

export default React.memo(function LegalContainer(props) {
  const { language } = useShallowSelector(state => ({
    language: state.base.language,
  }));

  const { pathname } = useLocation();
  const lastUrl = pathname.split('/').pop();
  const policyUrl = require(`static/files/legal/${language}/bridge_${lastUrl}.htm`);
  const iframeHeight = useInput(0);

  const onLoad = e => {
    iframeHeight.onChange({
      value: e.target.contentWindow.document.querySelector('.WordSection1')?.scrollHeight + 20,
    });
  };

  return (
    <Legal lastUrl={lastUrl} policyUrl={policyUrl} onLoad={onLoad} iframeHeight={iframeHeight} />
  );
});

export const Legal = React.memo(({ lastUrl, iframeHeight, policyUrl, onLoad = () => {} }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Styled.Legal data-component-name="Legal" iframeHeight={iframeHeight}>
      <div className="legal__container main-layout">
        <div className="legal__container_option_box">
          <Grid container>
            <Grid item xs={2} className="legal__container_option_btn_wrapper">
              <MuiButton
                disableElevation
                variant={lastUrl == 'privacy' ? 'contained' : 'outlined'}
                color="primary"
                className="legal__container_option_btn"
                onClick={() => {
                  history.push(pageUrl.legal.privacyPolicy);
                }}
              >
                <T>LEGAL_PRIVACY_POLICY</T>
              </MuiButton>
            </Grid>
            <Grid item xs={2} className="legal__container_option_btn_wrapper">
              <MuiButton
                disableElevation
                variant={lastUrl == 'terms' ? 'contained' : 'outlined'}
                color="primary"
                className="legal__container_option_btn"
                onClick={() => {
                  history.push(pageUrl.legal.termsOfService);
                }}
              >
                <T>LEGAL_TERMS_OF_SERVICE</T>
              </MuiButton>
            </Grid>
          </Grid>
        </div>
        <div className="legal__container_content_box">
          {lastUrl == 'terms' && (
            <div className="legal__container_content_header terms">
              <T>LEGAL_TERMS_OF_SERVICE_HEADER</T>
            </div>
          )}
          <h1 className="legal__title page-title">
            {lastUrl == 'privacy' && (
              <span className="legal__title_content">
                <T>LEGAL_PRIVACY_POLICY</T>{' '}
                <span className="legal__updated_date">
                  <T>LEGAL_LATEST_UPDATED</T>{' '}
                  <Trans defaults="LEGAL_LATEST_UPDATED_POLICY" components={[<span></span>]} />
                </span>
              </span>
            )}
            {lastUrl == 'terms' && (
              <span className="legal__title_content">
                <T>LEGAL_TERMS_OF_SERVICE</T>{' '}
                <span className="legal__updated_date">
                  <T>LEGAL_LATEST_UPDATED</T>{' '}
                  <Trans defaults="LEGAL_LATEST_UPDATED_TERMS" components={[<span></span>]} />
                </span>
              </span>
            )}
          </h1>
          <div className="legal__container_content">
            {useMemo(() => {
              return (
                <iframe
                  id="legalIframe"
                  className="legal__container_content_iframe"
                  src={policyUrl}
                  onLoad={e => onLoad(e)}
                ></iframe>
              );
            }, [policyUrl])}
          </div>
        </div>
      </div>
    </Styled.Legal>
  );
});

const Styled = {
  Legal: styled.section`
    margin-top: 60px;
    height: 100%;
    .page-title {
      ${beforeDash({})};
    }

    .legal__container_option_btn_wrapper {
      padding-right: 20px;
      .legal__container_option_btn {
        width: 100%;
        border-radius: 30px;
      }
    }
    .legal__container_content_box {
      .legal__container_content_header {
        padding: 50px 45px 90px 45px;
        background-color: #f5fcff;
        margin-top: 50px;
        margin-bottom: 25px;
        font-size: 20px;
        line-height: 40px;
      }
      .legal__title {
        margin-top: 50px;
        font-size: 30px;
        .legal__title_content {
          display: flex;
          align-items: flex-end;
          .legal__updated_date {
            padding-left: 45px;
            font-size: 19px;
            color: #33b5e4;
          }
        }
      }
    }
    .legal__container_content_iframe {
      width: 100%;
      margin-top: 50px;
      height: ${({ iframeHeight }) => (!!iframeHeight?.value ? iframeHeight?.value + 'px' : '0px')};
    }
  `,
};
