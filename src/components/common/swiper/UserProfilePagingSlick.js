import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { useShallowSelector } from 'lib/utils';
import { color } from 'styles/utils';
import cx from 'classnames';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return '';
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <span className={className}>
      <ArrowForwardIosRoundedIcon htmlColor={color.gray_font2} size="inherit" onClick={onClick} />
    </span>
  );
}

/**
 * // TODO: 차후 각각의 이미지 너비, 높이 큰거 기준 width, hegit 설정해주기 or 포트폴리오 사진 비율 확정 후 그에 맞게 변경
 * @param {Number} height : main slide width height ratio, 5:3
 */
export default function UserProfilePagingSlick({
  portfolioList = [],
  height,
  backgroundColor,
  pagerAbsolute,
}) {
  const { accessToken } = useShallowSelector(state => ({
    accessToken: state.auth.accessToken,
  }));

  const [initSlide, setInitSlide] = useState(0);
  const [counts, setCounts] = useState(1);
  const [nav1, setNav1] = useState([]);
  const [nav2, setNav2] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, []);

  let slider1 = [];
  let slider2 = [];

  const settings_slider1 = {
    asNavFor: nav2,
    ref: slider => (slider1 = slider),
    dots: false,
    fade: true,
    speed: 500,
    slidesToShow: 1,
    infinite: true,
    // focusOnSelect: true,
    initialSlide: initSlide,
    arrows: false,
    // slidesToScroll: 1,
  };

  const settings_slider2 = {
    asNavFor: nav1,
    ref: slider => (slider2 = slider),
    // slidesToShow: portfolioList.length > 3 ? 4 : portfolioList.length,
    slidesToShow: 3,
    focusOnSelect: true,
    swipeToSlide: true,
    speed: 300,
    initialSlide: initSlide,
    arrows: portfolioList.length > 4 ? true : false,
    // arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: current => setCounts(current + 1),
  };

  return (
    <Styled.UserProfilePagingSlick data-component-name="UserProfilePagingSlick">
      <Styled.CustomSlider
        {...settings_slider1}
        height={height}
        backgroundColor={backgroundColor}
        pagerAbsolute={pagerAbsolute}
      >
        {portfolioList.map((item, index) => {
          // console.log('slick item ______ ', item);
          return (
            <div key={item?.cloudDataIdx} className="slider__box">
              <div className="slider__img_box">
                <figure className="slider__img">
                  <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
                </figure>
              </div>
              <figcaption className="slider__text_box">
                <div className="slider__text_title">{item?.title}</div>
                <div className="slider__text_comment">{item?.detail}</div>
              </figcaption>
            </div>
          );
        })}
      </Styled.CustomSlider>

      <div
        className={cx('slider__pager_box', {
          pager_absolute: !!pagerAbsolute,
        })}
      >
        <Styled.CustomSlider2 {...settings_slider2}>
          {portfolioList.map((item, index) => (
            <div key={item?.cloudDataIdx} className="slider__pager_img_box">
              <figure className="slider__paper_img">
                <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
              </figure>
            </div>
          ))}
        </Styled.CustomSlider2>

        <div className="slider__count_box">
          {counts}/{portfolioList.length}
        </div>
      </div>
    </Styled.UserProfilePagingSlick>
  );
}

const Styled = {
  UserProfilePagingSlick: styled.div`
    /* overflow: hidden; */
    position: relative;
    .slider__count_box {
      font-size: 12px;
      font-weight: normal;
      position: absolute;
      right: 0;
      bottom: 2px;
    }
    .slider__pager_box {
      width: 100%;
      &.pager_absolute {
        top: 132px;
        left: 0;
        position: absolute;
      }
    }
  `,
  CustomSlider: styled(Slider)`
    position: relative;
    /* .slick-slide .slick-list {
      outline: none;
    } */

    .slick-list {
      height: ${({ height }) => (height ? `${height}px` : `132px`)};
      /* height: ${({ height }) => (height ? `${height}px` : `340px`)}; */
      .slick-track {
          .slick-slide {
            z-index: 0;
            &.slick-active {
              z-index: 999;
            }
          }
        }
    }
    .slider__img_box {
      outline: none;
    }
    .slider__img {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 132px;
      /* border-radius: 5px; */
      /* background-color: #fff; */
      background-color: ${({ backgroundColor }) =>
        backgroundColor == 'light' ? `#f2f2f2` : `#ffffff`};
      overflow: hidden;
      img {
        height: 100%;
        /* width: 100%; */
      }
    }

    .slider__text_box {
      padding-right: 10px;
      margin-top: 60px;
      max-height: 150px;
      overflow-y: auto;
      font-size: 13px;
      line-height: 17px;
      .slider__text_title {
        padding-bottom: 5px;
        border-bottom: 2px solid #ffffff;
        margin-bottom: 5px;
        white-space: break-spaces;
        word-break: break-all;
      }
      .slider__text_comment {
        white-space: break-spaces;
        word-break: break-all;

      }
    }
  `,
  CustomSlider2: styled(Slider)`
    position: relative;
    width: 165px;

    .slick-list {
      height: 37px;
      /* margin-top: 7px; */
      margin-top: 10px;
      .slick-track {
        margin-left: initial;
        margin-right: initial;
      }
    }
    .slick-slide {
      padding-right: 5px;
    }
    .slider__pager_img_box {
      outline: none;
    }
    .slider__paper_img {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 37px;
      background-color: #fff;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .slick-arrow {
      &.slick-prev:before,
      &.slick-next:before {
        display: none;
      }
      &.slick-next {
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        right: -13.5px;
        svg {
          font-size: 19px;
        }
      }
    }
  `,
};
