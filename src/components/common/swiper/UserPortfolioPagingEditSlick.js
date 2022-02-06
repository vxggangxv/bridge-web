import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import cx from 'classnames';
import { color } from 'styles/utils';
import { icon_trashcan_new } from 'components/base/images';
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
export default React.memo(function UserPortfolioPagingEditSlick({
  height,
  backgroundColor,
  isSelectedIdx,
  portfolioList = [],
  onClickPortfolioList = () => {},
  onClickPortfolioDelete = () => {},
}) {
  const { accessToken, editPortfolioSuccess } = useShallowSelector(state => ({
    accessToken: state.auth.accessToken,
    editPortfolioSuccess: state.bin.editPortfolioFile.success,
  }));

  const [initSlide, setInitSlide] = useState(0);

  const settings_slider = {
    slidesToShow: 5,
    focusOnSelect: false,
    swipeToSlide: true,
    speed: 300,
    arrows: true,
    initialSlide: initSlide,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Styled.UserPortfolioPagingEditSlick data-component-name="UserPortfolioPagingEditSlick">
      <Styled.CustomSlider {...settings_slider}>
        {portfolioList.map((item, index) => (
          <div
            key={item?.cloudDataIdx}
            className="userPortfolioPagingEditSlick__pager_img_box"
            onClick={e => {
              onClickPortfolioList(item);
            }}
          >
            <figure className="userPortfolioPagingEditSlick__paper_img">
              <img src={item?.cloudDirectory} alt={`portfolio-${item?.cloudDataIdx}`} />
            </figure>
            <div className="userPortfolioPagingEditSlick__pager_img_box_outline"></div>
            <div
              className="userPortfolioPagingEditSlick__pager_img_delete cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onClickPortfolioDelete(item?.cloudDataIdx);
              }}
            >
              <img src={icon_trashcan_new} />
            </div>
            <div
              className={cx(isSelectedIdx.value === item.cloudDataIdx ? 'selectedPortfolio' : '')}
            ></div>
          </div>
        ))}
      </Styled.CustomSlider>

      <div className="userPortfolioPagingEditSlick__bottom">
        <div className="userPortfolioPagingEditSlick__bottom_warn">
          <T>GLOBAL_IMAGE_UPLOAD_INFO</T>
        </div>
        <div className="slider__count_box">
          {portfolioList.length > 0 &&
            isSelectedIdx.value &&
            portfolioList.findIndex(
              portfolioList => isSelectedIdx.value === portfolioList.cloudDataIdx,
            ) + 1}
          {' / ' + portfolioList?.length}
        </div>
      </div>
    </Styled.UserPortfolioPagingEditSlick>
  );
});

const Styled = {
  UserPortfolioPagingEditSlick: styled.div`
    width: 815px;
    margin: 0 auto;

    position: relative;

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

    .userPortfolioPagingEditSlick__bottom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .userPortfolioPagingEditSlick__bottom_warn {
        color: #00a6e2;
      }
      .slider__count_box {
        color: ${color.gray_font2};
      }
    }
  `,

  CustomSlider: styled(Slider)`
    position: relative;
    width: 825px;
    /* .slick-slide .slick-list {
      outline: none;
    } */
    margin-bottom: 20px;

    .selectedPortfolio {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00a6e2;
      opacity: 0.4;
    }
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
    .userPortfolioPagingEditSlick__pager_img_box {
      position: relative;
      .userPortfolioPagingEditSlick__pager_img_box_outline {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .userPortfolioPagingEditSlick__pager_img_delete {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    .userPortfolioPagingEditSlick__paper_img {
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
      .userPortfolioPagingEditSlick__pager_img_box {
        background-color: #ececec;
        .userPortfolioPagingEditSlick__pager_img_box_outline {
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
