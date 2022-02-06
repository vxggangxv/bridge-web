// import { getCookie, keys } from 'lib/storage';
import AppFooter from 'components/base/footer/AppFooter';
import { main_create } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import PlainModal from 'components/common/modal/PlainModal';
import T from 'components/common/text/T';
import LegalUpdateContainer from 'containers/legal/LegalUpdateContainer';
import { useShallowSelector } from 'lib/utils';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { color, robotoFont } from 'styles/utils';

function MainHome({ isOpenLegalPopup, accessToken, onGetStarted }) {
  const { language } = useShallowSelector(state => ({
    language: state.base.language,
  }));

  // const { isOpenLegalPopup } = props;
  const history = useHistory();
  return (
    <Styled.MainHome data-component-name="MainHome" language={language}>
      <div className="main__choice_container">
        <div className="main__choice_box main-layout">
          <section className="main__choice create">
            <figure className="main__choice_picture">
              <img src={main_create} alt="create project" />
            </figure>
            <div className="main__choice_content">
              <h1 className="main__choice_title">
                <T>MAIN_PAGE_TITLE</T>
              </h1>
              <h2 className="main__choice_subtitle">
                <T>MAIN_PAGE_SUBTITLE_1</T>
              </h2>
              <h3>
                <T>MAIN_PAGE_SUBTITLE_2</T>
              </h3>

              {/* <button
                className="main__start_btn btn-reset"
                onClick={() => history.push(pageUrl.project.create)}
              >
                <T>GLOBAL_GET_STARTED</T>
              </button> */}
              <MuiButton
                config={{
                  width: 200,
                  color: '#fff',
                  fontColor: color.navy_blue,
                }}
                variant="contained"
                className="lg border-radius-round main__start_btn"
                onClick={onGetStarted}
              >
                <T>GLOBAL_PROJECT_GET_STARTED</T>
              </MuiButton>
            </div>
          </section>
        </div>
      </div>
      <AppFooter
      // leftBgColor={color.navy_blue}
      // rightBgColor={'white'}
      // rightFontColor={color.black_font}
      // hasCenterBar={false}
      />

      <PlainModal
        isOpen={isOpenLegalPopup.value}
        onClick={() => isOpenLegalPopup.setValue(false)}
        dim={false}
        content={
          <LegalUpdateContainer
            isOpenLegalPopup={isOpenLegalPopup}
            accessToken={accessToken}
            onClose={() => isOpenLegalPopup.setValue(false)}
            // orderNo={orderNo.value}
          />
        }
        width={680}
        isCloseIcon={false}
        borderRadius={10}
        maxHeight={860}
        overflowX={'hidden'}
        overflowY={'hidden'}
      />
    </Styled.MainHome>
  );
}

const Styled = {
  MainHome: styled.div`
    position: relative;
    width: 100%;
    background-color: ${color.navy_blue};

    .main__choice_box {
      display: flex;
      height: 100%;
    }
    .main__choice {
      position: relative;
      display: flex;
      width: 100%;
      height: 845px;
      padding-top: 200px;
      font-family: ${robotoFont};

      &.create {
        color: #fff;
      }

      .main__choice_picture {
        /* padding-top: 30px; */
      }

      .main__choice_content {
        margin-left: 90px;
        h1 {
          position: relative;
          left: -5px;
          font-size: ${({ language }) => (language === 'ko' ? '34px' : '45px')};
          font-weight: 700;
          line-height: ${({ language }) => (language === 'ko' ? 1.8 : 1.5)};
          letter-spacing: -1.2px;
          white-space: nowrap;
        }
        h2,
        h3 {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: -0.3px;
          line-height: 1.4;
        }
        h2 {
          margin-top: 50px;
        }
        h3 {
          margin-top: 20px;
        }
        .main__start_btn {
          margin-top: 50px;
          font-family: ${robotoFont};
          font-weight: 500;
          transition: none;
          &:hover {
            background: ${({ theme }) => theme.color.primary};
            background: ${({ theme }) => theme.gradient.primary};
            border: 1px solid white;
            color: white;
          }
        }
      }
    }

    .footer {
      margin-top: 120px;
    }
  `,
};

export default React.memo(MainHome);
