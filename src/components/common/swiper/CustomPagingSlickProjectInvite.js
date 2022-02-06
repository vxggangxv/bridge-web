import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { useShallowSelector } from 'lib/utils';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import cx from 'classnames';
import { teethContextActionsInitValue } from 'lib/teeth/teethMapper';
import { color } from 'styles/utils';

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
export default function CustomPagingSlickProjectInvite({ portfolioList = [], height, background }) {
  const { accessToken } = useShallowSelector(state => ({
    accessToken: state.auth.accessToken,
  }));

  const sliderRef = useRef();
  const [initSlide, setInitSlide] = useState(0);
  const [counts, setCounts] = useState(1);
  // const slider_length = portfolioList.length > 3 ? 4 : portfolioList.length;
  const [nav1, setNav1] = useState([]);
  const [nav2, setNav2] = useState([]);

  // const [slider1Settings, setSlidet1Settings] = useState(settings_slider1);
  // const [slider2Settings, setSlidet2Settings] = useState(settings_slider2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
    // setSlidet1Settings(draft => ({ ...draft, initialSlide: 0 }));
  }, []);

  // useEffect(() => {
  //   setCounts(1);
  //   // console.log('work count');
  //   setLoading(false);
  //   // if (!!portfolioList.length) {
  //   //   setNav1(slider1);
  //   //   setNav2(slider2);
  //   // }
  // }, [portfolioList]);

  let slider1 = [];
  let slider2 = [];

  const settings_slider1 = {
    asNavFor: nav2,
    ref: slider => (slider1 = slider),
    dots: false,
    fade: true,
    infinite: true,
    focusOnSelect: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initSlide,
    arrows: false,
  };

  const settings_slider2 = {
    asNavFor: nav1,
    ref: slider => (slider2 = slider),
    // slidesToShow: portfolioList.length > 3 ? 4 : portfolioList.length,
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    speed: 300,
    arrows: portfolioList.length > 4 ? true : false,
    // arrows: true,
    initialSlide: initSlide,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: current => setCounts(current + 1),
  };

  // useEffect(() => {
  //   console.log('portfolioList', portfolioList);
  // }, [portfolioList]);

  // if (loading) return null;
  return (
    <Styled.CustomPagingSlickProjectInvite data-component-name="CustomPagingSlickProjectInvite">
      <Styled.CustomSlider {...settings_slider1} height={height} background={background}>
        {portfolioList.map((item, index) => (
          <div key={item?.cloudDataIdx} className="slider__img_box">
            <figure className="slider__img">
              <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
            </figure>
          </div>
        ))}
      </Styled.CustomSlider>

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
    </Styled.CustomPagingSlickProjectInvite>
  );
}

const Styled = {
  CustomPagingSlickProjectInvite: styled.div`
    /* overflow: hidden; */
    position: relative;
    .slider__count_box {
      font-size: 12px;
      font-weight: normal;
      position: absolute;
      right: 0;
      bottom: 2px;
    }
  `,
  CustomSlider: styled(Slider)`
    position: relative;
    /* .slick-slide .slick-list {
      outline: none;
    } */

    .slick-list {
      height: ${({ height }) => (height ? `${height}px` : `132px`)};
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
      border-radius: 5px;
      /* background-color: #ffffff; */
      background-color: ${({ background }) =>
        background == 'light' ? (background = `#f2f2f2`) : (background = `#ffffff`)};
      overflow: hidden;
      img {
        height: 100%;
        /* width: 100%; */
      }
    }
  `,
  CustomSlider2: styled(Slider)`
    position: relative;
    width: 165px;

    /* .slick-slide .slick-list {
      outline: none;
    } */

    .slick-list {
      height: 37px;
      margin-top: 7px;
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
