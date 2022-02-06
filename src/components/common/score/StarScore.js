import React, { useState } from 'react';
import styled from 'styled-components';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import StarIcon from '@material-ui/icons/Star';
// import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
// import StarHalfRoundedIcon from '@material-ui/icons/StarHalfRounded';
import { color } from 'styles/utils';
import { icon_star_on, icon_star_off } from 'components/base/images';
import { Fragment } from 'react';
import cx from 'classnames';

export default function StarScore(props) {
  let {
    max = 5,
    score = 0,
    size = 20,
    gutter = 0,
    hideText = false,
    align = '',
    isEdit = false,
    activeIcon = icon_star_on,
    unactiveIcon = icon_star_off,
    isComponent = false,
    className = '',
  } = props;

  let scoreProp = score;
  if (isEdit) {
    scoreProp = score.value;
  }
  // index맞혀줌
  const [scoreValue, setScoreValue] = useState(Math.floor(scoreProp));
  // const scoreDecimalPercent = ((scoreProp % 1) * 100) / max;
  const scoreDecimalPercent = (scoreProp % 1) * 100;
  // console.log('scoreProp', scoreProp);
  // console.log('scoreDecimalPercent', scoreDecimalPercent);
  // console.log('scoreValue', scoreValue);

  const handleScore = idx => {
    if (!isEdit) return;
    setScoreValue(idx);
    score.setValue(idx);
    if (idx === scoreValue) {
      setScoreValue(0);
      score.setValue(0);
    }
  };

  return (
    <Styled.StarScore
      data-component-name="StarScore"
      className={className}
      size={size}
      gutter={gutter}
      align={align}
      activeIcon={activeIcon}
      unactiveIcon={unactiveIcon}
    >
      <div className="starScore__container">
        <div className={cx('starScore__star_box unactive', { 'cursor-pointer': isEdit })}>
          {Array.from({ length: max }).map((item, index) => {
            const idx = index + 1;
            return (
              <Fragment key={idx}>
                <div
                  className="starScore__star"
                  style={{ width: '100%' }}
                  onClick={() => handleScore(idx)}
                >
                  <span className="starScore__icon_box" style={{ fontSize: size }}>
                    {isComponent ? (
                      <>{unactiveIcon}</>
                    ) : (
                      <img src={icon_star_off} width={size} alt="icon" />
                      // <StarRoundedIcon htmlColor="#e3e3e3" />
                    )}
                  </span>
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className={cx('starScore__star_box active', { 'cursor-pointer': isEdit })}>
          {Array.from({ length: max }).map((item, index) => {
            const idx = index + 1;
            const percentIdx = idx === scoreValue + 1;
            // console.log('percentIdx', percentIdx);
            return (
              <Fragment key={idx}>
                {idx <= scoreValue && (
                  <div className="starScore__star" onClick={() => handleScore(idx)}>
                    <span className="starScore__icon_box" style={{ fontSize: size }}>
                      {isComponent ? (
                        <>{activeIcon}</>
                      ) : (
                        <img src={icon_star_on} width={size} alt="icon" />
                        // <StarRoundedIcon htmlColor="#FFC632" />
                      )}
                    </span>
                  </div>
                )}
                {percentIdx && (
                  <div className="starScore__star" onClick={() => handleScore(idx)}>
                    <span
                      className="starScore__icon_box"
                      style={{
                        width: `${scoreDecimalPercent}%`,
                        overflow: 'hidden',
                        fontSize: size,
                      }}
                    >
                      {isComponent ? (
                        <> {activeIcon}</>
                      ) : (
                        <img src={icon_star_on} width={size} alt="icon" />
                        // <StarRoundedIcon htmlColor="#FFC632" />
                      )}
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {!hideText && <span className="starScore__rate">{!!score ? score.toFixed(1) : 0}</span>}
    </Styled.StarScore>
  );
}

const Styled = {
  StarScore: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: ${({ align }) => align};
    .starScore__container {
      position: relative;
      line-height: 0;
    }
    .starScore__star_box {
      position: relative;
      display: inline-flex;
      align-items: center;
      &.active {
        position: absolute;
        left: 0;
      }
      .starScore__star {
        overflow: hidden;
        display: inline-flex;
        &:not(:first-child) {
          margin-left: ${({ gutter }) => `${gutter}px`};
        }
        .starScore__icon_box {
          display: inline-flex;
          svg {
            font-size: inherit;
          }
        }
      }
    }
    .starScore__rate {
      position: relative;
      font-size: 16px;
      margin-left: 5px;
    }
  `,
};
