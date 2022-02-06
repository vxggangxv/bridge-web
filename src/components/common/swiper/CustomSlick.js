import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

export default function CustomSlick() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Styled.CustomSlick data-component-name="CustomSlick">
      <Styled.CustomSlider {...settings}>
        <div>
          <figure className="slider__img">1</figure>
        </div>
        <div>
          <figure className="slider__img">2</figure>
        </div>
        <div>
          <figure className="slider__img">3</figure>
        </div>
        <div>
          <figure className="slider__img">4</figure>
        </div>
        <div>
          <figure className="slider__img">5</figure>
        </div>
        <div>
          <figure className="slider__img">6</figure>
        </div>
      </Styled.CustomSlider>
    </Styled.CustomSlick>
  );
}

const Styled = {
  CustomSlick: styled.div``,
  CustomSlider: styled(Slider)`
    .slick-slide div {
      outline: none;
    }
    .slider__img {
      width: 740px;
      height: 460px;
      background-color: yellow;
    }
  `,
};
