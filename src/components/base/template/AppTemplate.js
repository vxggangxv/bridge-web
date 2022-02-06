import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import cx from 'classnames';
import AppFooter from 'components/base/footer/AppFooter';
import AppHeader from 'components/base/header/AppHeader';
import AppMeta from 'components/base/meta/AppMeta';
import { AppContext } from 'contexts/AppContext';
import { cutUrl } from 'lib/library';
import { debounce, throttle } from 'lodash';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { color, device } from 'styles/utils';

function AppTemplate(props) {
  const {
    className = '',
    title = '',
    // defaultTemplate = true,
    flexCenterTemplate = false,
    nav,
    children,
    childrenTitle,
    leftSide,
    rightSide,
    templateStyle, // AppTemplate 스타일 커스텀 prop
    defaultMainContainer = true, // .template__main_container 기본 스타일 적용 유무
    isTemplateMain = true, // template안에 main들어갈지 여부, false일 경우 별도의 main스타일 구성
    mainContainerStyle, //.template__main_container 스타일 커스텀 prop
    mainChildrenStyle, //.template__main_children 스타일 커스텀 prop
    headerHide = false,
    footerHide = false,
    mainTheme: mainThemeProp = '',
    mainContainerPaddingBottom = 40, // template__main_container 기본 paddingBottom 설정
  } = props;

  const headerRef = useRef(null);
  const footerRef = useRef(null);
  // const windowHeight = window.innerHeight;
  const [size, setSize] = useState([0, 0]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isShowTopBtn, setIsShowTopBtn] = useState(false);
  const { pathname } = useLocation();
  const currentPage = cutUrl(pathname);
  const isCreateEditPage = ['project/create', 'project/edit'].includes(
    `${cutUrl(pathname)}/${cutUrl(pathname, 1)}`,
  );
  const isDesignerPage = `${cutUrl(pathname)}` === 'designers';
  // project client
  const { isProjectClient } = useContext(AppContext);
  // check 1300
  const isLteDeviceLg = useMemo(() => {
    return size[0] <= 1470;
  }, [size[0]]);

  const isDarkMain = useMemo(() => {
    // const darkMainList = [isCreateEditPage, isProjectClient, isDesignerPage];
    const darkMainList = [isCreateEditPage, isProjectClient];
    // console.log('darkMainList', darkMainList);
    return darkMainList.some(item => item === true);
  }, [pathname, isProjectClient]);

  // init theme
  const mainTheme = useMemo(() => {
    if (mainThemeProp) {
      return mainThemeProp;
    } else if (isDarkMain) {
      return 'dark';
    } else {
      return 'light';
    }
  }, [isDarkMain, mainThemeProp]);

  useEffect(() => {
    console.log('isProjectClient', isProjectClient);
  }, [isProjectClient]);

  // set default main height
  const updateSize = throttle(() => {
    setSize([window.innerWidth, window.innerHeight]);
  }, 500);

  const exceptMainHeight = useCallback(() => {
    return headerHeight + footerHeight + 2;
  }, [headerHeight, footerHeight]);

  const mainHeight = size[1] - exceptMainHeight();

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth',
    });
  };

  const handleScrollWindow = debounce(e => {
    // console.log(e);
    // console.log(window.scrollY);
    if (window.scrollY > 90) {
      setIsShowTopBtn(true);
    } else {
      setIsShowTopBtn(false);
    }
  }, 500);

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();

    setHeaderHeight(headerRef.current?.clientHeight);
    setFooterHeight(footerRef.current?.clientHeight);

    // NOTE: goTopButton show effect
    window.addEventListener('scroll', handleScrollWindow);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', handleScrollWindow);
    };
  }, []);

  // NOTE: header 있을경우, headerHide = true 아닐 경우 기본 값 설정
  const header = props.header ? props.header : !headerHide ? <AppHeader /> : null;
  const footer = props.footer ? props.header : !footerHide ? <AppFooter /> : null;

  return (
    <>
      <AppMeta title={title} />
      <Styled.AppTemplate
        data-component-name="AppTemplate"
        currentPage={currentPage}
        mainHeight={mainHeight}
        style={templateStyle}
        className={cx(`template ${className}`, {
          // default: defaultTemplate,
          flexCenterTemplate: flexCenterTemplate,
        })}
      >
        {header && <div className={cx('template__header')} children={header} ref={headerRef} />}

        {/* NOTE: header와 nav가 분리되어있을 경우 */}
        {nav && <div className={cx('template__nav')} children={nav} />}

        {children && (
          <>
            {isTemplateMain ? (
              <div
                className={cx('template__main_container', { default: defaultMainContainer })}
                style={{
                  ...mainContainerStyle,
                  paddingBottom: `${mainContainerPaddingBottom}px`,
                  backgroundColor: mainTheme === 'dark' && color.navy_blue,
                }}
              >
                {leftSide && <div className={cx('template__leftSide')} children={leftSide} />}
                <main className={cx('template__main', { main_title: childrenTitle })}>
                  {childrenTitle && <h1 className="template__main_title">{childrenTitle}</h1>}

                  {children && <div className={cx('template__main_children')}>{children}</div>}
                </main>
                {rightSide && <div className={cx('template__rightSide')} children={rightSide} />}
              </div>
            ) : (
              children
            )}
          </>
        )}

        {footer && <div className={cx('template__footer')} children={footer} ref={footerRef} />}

        <button
          className={cx('template__top_btn btn-reset', { on: isShowTopBtn, min: isLteDeviceLg })}
          onClick={handleGoTop}
        >
          <KeyboardArrowUpRoundedIcon fontSize="inherit" htmlColor={color.navy_blue} />
        </button>
      </Styled.AppTemplate>
    </>
  );
}

AppTemplate.propTypes = {
  title: PropTypes.string,
  headerHide: PropTypes.bool,
  footerHide: PropTypes.bool,
};

const Styled = {
  AppTemplate: styled.div`
    position: relative;
    min-width: ${`${device.lg}px`};
    position: ${({ currentPage }) => currentPage === 'home' && 'initial'};
    /* min-width: ${({ currentPage }) => currentPage === 'home' && '1914px'}; */
    &.flexCenterTemplate {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      min-width: 100%;
      min-height: 100%;
    }
    .template__main_container {
      position: relative;
      &.default {
        /* min-width: ${`${device.lg}px`}; */
        /* min-width: 1440px; */
        /* min-width: 1200px; */
        min-height: ${props => props.mainHeight + 'px'};
        margin: auto;
      }

      /* @media screen and (max-width: 1200px) {
        width: 100%;
        padding: 15px;
      } */
    }
    .template__top_btn {
      position: fixed;
      bottom: 200px;
      left: 50%;
      margin-left: 650px;
      width: 65px;
      height: 65px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
      font-size: 50px;
      line-height: 0;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s;

      &.on {
        opacity: 1;
        visibility: visible;
      }
      &.min {
        left: initial;
        margin-left: initial;
        right: 10px;
      }
    }
  `,
};

export default AppTemplate;
