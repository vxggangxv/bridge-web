import React from 'react';
import cx from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
// import HomeIcon from '@material-ui/icons/Home';
import RefreshIcon from '@material-ui/icons/Refresh';
import ReplyIcon from '@material-ui/icons/Reply';

function ErrorForm(props) {
  const {
    code = '',
    text = '',
    infoText = null,
    infoHide = false,
    link = '/',
    linkText = 'Home',
  } = props;
  const history = useHistory();
  const handleRefresh = linkText => {
    return linkText?.toLowerCase() === 'refresh' ? () => window.location.reload() : null;
  };

  return (
    <Styled.ErrorForm data-component-name="ErrorForm">
      <div className="error__container">
        <p className="error__title">
          <span className="error__title_code">{code}</span>
          {!infoHide && <br />}
          <span className={cx('error__title_text', { infoHide: infoHide })}>{text}</span>
        </p>
        {!infoHide && (
          <>
            {!infoText && (
              <p className="error__content">
                Oops, something went wrong.
                <br />
                <br />
                The server encountered an internal error or misconfiguration and was unable to
                complete your request.
              </p>
            )}
            {infoText && <p className="error__content">{infoText}</p>}
          </>
        )}
        <div className="error__link_box">
          <Link to={link} className="error__link" onClick={handleRefresh(linkText)}>
            <RefreshIcon className="error__link_icon" />{' '}
            <span className="error_link_home">{linkText}</span>
          </Link>
          <a
            className="error__link cursor-pointer"
            onClick={e => {
              e.preventDefault();
              history.goBack();
            }}
          >
            <ReplyIcon className="error__link_icon" /> <span className="error_link_home">Back</span>
          </a>
        </div>
      </div>
    </Styled.ErrorForm>
  );
}

const Styled = {
  ErrorForm: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .error__container {
      width: 460px;
      color: #767675;
    }
    .error__title,
    .error__link_box {
      text-align: left;
    }
    .error__title {
      margin-top: -50px;
      font-weight: 700;
      .error__title_code {
        font-size: 75px;
        color: #bbb;
      }
      .error__title_text {
        font-size: 45px;
        color: #d2567e;
        &.infoHide {
          margin-left: 10px;
        }
      }
    }
    .error__content {
      margin-top: 25px;
      font-size: 15px;
      line-height: 1.3;
    }
    .error__link_box {
      margin-top: 12px;
      margin-left: 3px;
      display: flex;
      align-items: bottom;
      .error__link {
        display: inline-flex;
        align-items: center;
        font-weight: 700;
        font-size: 20px;
        border-bottom: 2px solid #767675;
        & + .error__link {
          margin-left: 15px;
        }
        .error__link_icon {
          margin-left: -5px;
        }
        .error__link_home {
          margin-left: 3px;
        }
      }
    }
  `,
};

export default ErrorForm;
