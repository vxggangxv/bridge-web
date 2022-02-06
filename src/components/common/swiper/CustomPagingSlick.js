import React from 'react';
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

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIosRoundedIcon
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIosRoundedIcon
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
}

export default function CustomPagingSlick({ portfolioList = [], isEdit, deletePortfolio }) {
  const { accessToken } = useShallowSelector(state => ({
    accessToken: state.auth.accessToken,
  }));
  const settings = {
    customPaging: function (i) {
      // console.log('i', i);
      return (
        <a
          className="slide__pager"
          onClick={e => {
            // e.stopPropagation();
            // e.preventDefault();
            // if (isEdit) return;
          }}
        >
          {isEdit && (
            <IconButton
              className={cx('slide__delete_btn', {
                on: deletePortfolio.value.has(portfolioList[i]?.cloudDataIdx),
              })}
              disableRipple
              onClick={e => {
                // deletePortfolio.setValue(draft => draft.concat(portfolioList[i]?.cloudDataIdx))
                e.stopPropagation();
                deletePortfolio.onChange({ value: portfolioList[i]?.cloudDataIdx });
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {/* <img src={`${baseUrl}/abstract0${i + 1}.jpg`} /> */}
          <img
            src={portfolioList[i]?.cloudDirectory}
            alt={`portfolio-${portfolioList[i]?.cloudDataIdx}`}
          />
        </a>
      );
    },
    dots: true,
    dotsClass: 'slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Styled.CustomPagingSlick data-component-name="CustomPagingSlick">
      <Styled.CustomSlider {...settings}>
        {/* {Array.from({ length: 8 }).map((item, index) => (
          <div key={index}>
            <figure className="slider__img">{index}</figure>
          </div>
        ))} */}
        {portfolioList?.length > 0 &&
          portfolioList.map((item, index) => (
            <div key={item?.cloudDataIdx} className="slider__img_box">
              <figure className="slider__img">
                <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
              </figure>
            </div>
          ))}
      </Styled.CustomSlider>
    </Styled.CustomPagingSlick>
  );
}

const Styled = {
  CustomPagingSlick: styled.div`
    /* overflow: hidden; */
    position: relative;
  `,
  CustomSlider: styled(Slider)`
    position: relative;
    .slick-slide .slick-list {
      outline: none;
    }
    .slick-list {
      width: 650px;
      height: 500px;
      margin: 0 auto;
    }
    .slider__img_box {
      outline: none;
    }
    .slider__img {
      position: relative;
      /* width: 100%; */
      /* background-color: yellow; */
      /* background-color: #eee; */
      /* height: 460px; */
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    .slick-thumb {
      position: relative;
      display: flex !important;
      flex-wrap: wrap;
      margin-top: 15px;
      & > li {
        position: relative;
        width: 275px;
        height: 220px;
        padding: 10px 7.5px;
        &:nth-child(4) ~ li {
          margin-top: -2.5px;
          margin-bottom: -2.5px;
        }
        .slide__pager {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          background-color: #eee;
          /* background-color: red; */
          cursor: pointer;
          img {
            width: 100%;
          }
          .slide__delete_btn {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 100%;
            height: 100%;
            border-radius: 0;
            background-color: rgba(0, 0, 0, 0.05);
            color: #fff;
            svg {
              border: 2px solid #fff;
              font-size: 50px;
            }
            &.on {
              background-color: rgba(0, 0, 0, 0.55);
            }
          }
        }
      }
    }
    .slick-arrow {
      /* background-color: gray; */
      color: #999;
      font-size: 35px;
      &.slick-prev,
      &.slick-next {
        top: 25%;
      }
      &.slick-prev {
        left: 120px;
      }
      &.slick-next {
        right: 120px;
      }
    }
  `,
};
