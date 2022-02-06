import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import MuiWrapper from 'components/common/input/MuiWrapper';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { useShallowSelector } from 'lib/utils';
import { color } from 'styles/utils';
import T from 'components/common/text/T';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <span className={className} onClick={onClick}>
      <ArrowBackIosRoundedIcon htmlColor={color.gray_font2} size="inherit" />
    </span>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <span className={className} onClick={onClick}>
      <ArrowForwardIosRoundedIcon htmlColor={color.gray_font2} size="inherit" />
    </span>
  );
}

/**
 * // TODO: 차후 각각의 이미지 너비, 높이 큰거 기준 width, hegit 설정해주기 or 포트폴리오 사진 비율 확정 후 그에 맞게 변경
 * @param {Number} height : main slide width height ratio, 5:3
 */
export default React.memo(function UserPortfolioPagingSlick({
  portfolioList = [],
  height,
  backgroundColor,
}) {
  const { accessToken, editPortfolioSuccess } = useShallowSelector(state => ({
    accessToken: state.auth.accessToken,
    editPortfolioSuccess: state.bin.editPortfolioFile.success,
  }));

  const [initSlide, setInitSlide] = useState(0);
  const [counts, setCounts] = useState(1);
  const [nav1, setNav1] = useState([]);
  const [nav2, setNav2] = useState([]);
  const [loading, setLoading] = useState(true);

  let slider1 = [];
  let slider2 = [];

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, []);

  const settings_slider1 = {
    asNavFor: nav2,
    ref: slider => (slider1 = slider),
    dots: false,
    fade: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    // focusOnSelect: true,
    initialSlide: initSlide,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  const settings_slider2 = {
    asNavFor: nav1,
    ref: slider => (slider2 = slider),
    slidesToShow: 5,
    focusOnSelect: true,
    swipeToSlide: true,
    speed: 300,
    arrows: true,
    initialSlide: initSlide,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: current => setCounts(current + 1),
  };

  return (
    <Styled.UserPortfolioPagingSlick data-component-name="UserPortfolioPagingSlick">
      <Styled.CustomSlider {...settings_slider1} height={height} backgroundColor={backgroundColor}>
        {portfolioList.map((item, index) => (
          <div key={item?.cloudDataIdx} className="userPortfolioPagingSlick__slide_box ">
            <div className="userPortfolioPagingSlick__img_box">
              <figure className="userPortfolioPagingSlick__img">
                <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
              </figure>
              <figcaption className="userPortfolioPagingSlick__img_info_wrapper">
                <div className="userPortfolioPagingSlick__img_info">
                  <MuiWrapper
                    className="userPortfolioPagingSlick__img_info_title_wrapper"
                    config={{ height: 'initial' }}
                  >
                    <div className="userPortfolioPagingSlick__img_info_title">{item?.title}</div>
                  </MuiWrapper>
                  <MuiWrapper
                    className="userPortfolioPagingSlick__img_info_comment_wrapper"
                    config={{ height: 'initial' }}
                  >
                    <div className="userPortfolioPagingSlick__img_info_comment">{item?.detail}</div>
                  </MuiWrapper>
                </div>
              </figcaption>
            </div>
          </div>
        ))}
      </Styled.CustomSlider>
      <Styled.CustomSlider2 {...settings_slider2}>
        {portfolioList.map((item, index) => (
          <div key={item?.cloudDataIdx} className="userPortfolioPagingSlick__pager_img_box">
            <figure className="userPortfolioPagingSlick__paper_img">
              <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
            </figure>
            <div className="userPortfolioPagingSlick__pager_img_box_outline"></div>
          </div>
        ))}
      </Styled.CustomSlider2>

      <div className="userPortfolioPagingSlick__bottom">
        <div className="userPortfolioPagingSlick__bottom_warn">
          {/* * JPG, GIF, or PNG only. Max size of 10MB(Up to 10 sheets) */}
          <T>GLOBAL_IMAGE_UPLOAD_INFO</T>
        </div>
        <div className="slider__count_box">
          {portfolioList.length > 0 && counts + ' / ' + portfolioList.length}
        </div>
      </div>
    </Styled.UserPortfolioPagingSlick>
  );
});

const Styled = {
  UserPortfolioPagingSlick: styled.div`
    width: 815px;
    margin: 0 auto;

    position: relative;

    .userPortfolioPagingSlick__bottom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .userPortfolioPagingSlick__bottom_warn {
        color: #00a6e2;
      }
      .slider__count_box {
        color: ${color.gray_font2};
      }
    }
    .slick-arrow {
      &.slick-prev:before,
      &.slick-next:before {
        display: none;
      }
      &.slick-next,
      &.slick-prev {
        width: 50px !important;
        height: 50px !important;
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        z-index: 2;

        svg {
          font-size: 19px;
          color: #000000;
        }
      }
    }
  `,
  CustomSlider: styled(Slider)`
    position: relative;
    margin-bottom: 60px;
    user-select: text;
    .slick-slide .slick-list {
      outline: none;
    }

    .slick-list {
      height: ${({ height }) => (height ? `${height}px` : `132px`)};
      background-color: ${({ backgroundColor }) =>
        backgroundColor == 'light' ? `#f2f2f2` : `#ffffff`};
        .slick-track {
          .slick-slide {
            z-index: 0;
            &.slick-active {
              z-index: 999;
            }
          }
        }
        
    }
    .userPortfolioPagingSlick__slide_box {
      outline: none;

      .userPortfolioPagingSlick__img_box {
        display: flex;
      }
      .userPortfolioPagingSlick__img {
        width: 605px;
        height: 362px;

        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        /* background-color: ${({ backgroundColor }) =>
          backgroundColor == 'light' ? `#f2f2f2` : `#ffffff`}; */
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .userPortfolioPagingSlick__img_info_wrapper {
        height: 362px;
        background-color: #00a6e2;
        width: 210px;
        padding: 20px 0;
        /* padding: 15px; */
        font-size: 15px;
        color: ${color.white};

        .userPortfolioPagingSlick__img_info {
          /* width: 100%; */
          width: 180px;
          margin: 0 auto;
          height: 100%;
          /* display: inline-block; */
          overflow-y:auto;
          
          .userPortfolioPagingSlick__img_info_title_wrapper {
            padding-bottom: 5px;
              margin-bottom: 5px;
              border-bottom: 1px solid ${color.white};
              font-size: 15px;
              width: 100%;
            .userPortfolioPagingSlick__img_info_title {
              color: ${color.white};
              white-space: break-spaces;
              word-break: break-all;
            }
          }
          .userPortfolioPagingSlick__img_info_comment_wrapper {
            margin-top: 5px;
            font-size: 15px;
            .userPortfolioPagingSlick__img_info_comment {
              white-space: break-spaces;
              word-break: break-all;
              display:inline-block;
              color: ${color.white};
              border: none;
    
            }
          }
        }
      }
    }
  `,
  CustomSlider2: styled(Slider)`
    position: relative;
    width: 825px;
    /* .slick-slide .slick-list {
      outline: none;
    } */
    margin-bottom: 20px;

    .slick-list {
      height: 92px;
      .slick-track {
        margin-left: initial;
        margin-right: initial;
      }
    }
    .slick-slide {
      /* width: 184px !important; */
      padding-right: 10px;
    }
    .userPortfolioPagingSlick__pager_img_box {
      position: relative;
      .userPortfolioPagingSlick__pager_img_box_outline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .userPortfolioPagingSlick__paper_img {
      position: relative;
      height: 92px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${color.white};
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .slick-current {
      .userPortfolioPagingSlick__pager_img_box {
        background-color: #ececec;
        .userPortfolioPagingSlick__pager_img_box_outline {
          background-color: transparent;

          /* box-shadow: 0 0 0 3px #1da7e0 inset; */
          box-shadow: 0 0 0 3px ${color.blue} inset;
        }
      }
    }

    .slick-arrow {
      &.slick-next,
      &.slick-prev {
        /* right: -17px; */
        right: -15px;
      }
    }
  `,
};
