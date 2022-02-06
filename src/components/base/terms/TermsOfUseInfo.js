import React, { useState } from 'react';
import styled from 'styled-components';
import { font, color } from 'styles/utils';
import PlainModal from 'components/common/modal/PlainModal';
import ModalTerms from 'components/common/modal/content/ModalTerms';
import T from 'components/common/text/T';
import { Trans } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';

export default function TermsOfUseInfo({ location = '', rightFontColor = '' }) {
  const [modalType, setModalType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const modalObj = {
    launcher: <ModalTerms type={'launcher'} />,
    process: <ModalTerms type={'process'} />,
    finance: <ModalTerms type={'finance'} />,
    collection: <ModalTerms type={'collection'} />,
    offer: <ModalTerms type={'offer'} />,
  };

  const currentModal = modalObj[modalType] || null;

  return (
    <>
      {currentModal && (
        <PlainModal
          dim={false}
          isOpen={isOpen}
          onClick={() => setIsOpen(false)}
          content={currentModal}
          width={'100%'}
          isCloseIcon={true}
        />
      )}
      <Styled.TermsOfUseInfo className="term__singup_info_box" rightFontColor={rightFontColor}>
        {/* <p className="term__info text">
          <T>SIGNUP_ACCEPT_TERMS_CONTENT1</T>
          <span
            className="term__info_link"
            onClick={() => {
              setIsOpen(true);
              setModalType('launcher');
            }}
          >
            <T>SIGNUP_ACCEPT_TERMS_CONTENT2</T>
          </span>{' '}
          <T>SIGNUP_ACCEPT_TERMS_CONTENT3</T>{' '}
          <span
            className="term__info_link"
            onClick={() => {
              setIsOpen(true);
              setModalType('process');
            }}
          >
            <T>SIGNUP_ACCEPT_TERMS_CONTENT4</T>
          </span>{' '}
          <T>SIGNUP_ACCEPT_TERMS_CONTENT5</T>
        </p> */}
        {location == 'signup' && (
          <p className="term__singup_info">
            <Trans
              defaults="SIGNUP_ACCEPT_TERMS_CONTENT"
              components={[
                <span></span>,
                <span
                  className="term__singup_info_link"
                  onClick={() => {
                    window.open(pageUrl.legal.termsOfService);
                    // setIsOpen(true);
                    // setModalType('launcher');
                  }}
                ></span>,
                <span
                  className="term__singup_info_link"
                  onClick={() => {
                    window.open(pageUrl.legal.privacyPolicy);
                    // setIsOpen(true);
                    // setModalType('process');
                  }}
                ></span>,
              ]}
            />
          </p>
        )}

        {location == 'footer' && (
          <p className="term__footer_info">
            {/* <a className="footer_terms_service underline" href="#" target="_blank">
              <T>TERMS_OF_SERVICE</T>
            </a> */}
            <span
              className="term__footer_info_service underline"
              onClick={() => {
                // setIsOpen(true);
                // setModalType('launcher');
                history.push(pageUrl.legal.termsOfService);
              }}
            >
              <T>TERMS_OF_SERVICE</T>
            </span>
            /
            <span
              className="term__footer_info_policy underline"
              onClick={() => {
                history.push(pageUrl.legal.privacyPolicy);
                // setIsOpen(true);
                // setModalType('process');
              }}
            >
              <T>PRIVACY_POLICY</T>
            </span>
            {/* <a
              href="#"
              target="_blank"
            >
              <T>PRIVACY_POLICY</T>
            </a> */}
          </p>
        )}
      </Styled.TermsOfUseInfo>
    </>
  );
}

const Styled = {
  TermsOfUseInfo: styled.div`
    /* text-align: center; */
    .term__singup_info {
      ${font(12, color.gray_font)};
      line-height: 18px;
      letter-spacing: 0.2px;
      display: inline-block;

      .term__singup_info_link {
        color: ${color.blue};
        font-weight: 700;
        cursor: pointer;
      }
    }
    .term__footer_info {
      padding-top: 15px;
      /* color: ${color.white}; */
      color: ${({ rightFontColor }) => (!!rightFontColor ? rightFontColor : 'white')};

      .underline {
        text-decoration: underline;
      }
      .term__footer_info_service {
        margin-right: 15px;
        &:hover {
          cursor: pointer;
        }
      }
      .term__footer_info_policy {
        margin-left: 15px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .link {
      cursor: pointer;
    }
  `,
};
