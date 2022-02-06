import React from 'react';
import styled from 'styled-components';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import StarHalfRoundedIcon from '@material-ui/icons/StarHalfRounded';
import { color } from 'styles/utils';

export default function StarScore(props) {
  const { max, score, className = '' } = props;
  const scoreValue = score - 1;

  return (
    <Styled.StarScore data-component-name="StarScore" className={className}>
      {Array.from({ length: max }).map((item, index) => (
        <span className="starScore_star" key={index}>
          {index <= scoreValue && <StarRoundedIcon htmlColor={color.yellow} fontSize="inherit" />}
          {index > scoreValue && (
            <StarOutlineRoundedIcon htmlColor={color.yellow} fontSize="inherit" />
          )}
        </span>
      ))}
      <span className="starScore_rate">{score}</span>
    </Styled.StarScore>
  );
}

const Styled = {
  StarScore: styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-left: -3px;
    .starScore_star {
      font-size: 26px;
    }
    .starScore_rate {
      position: relative;
      top: -2px;
      font-size: 16px;
      margin-left: 2px;
    }
  `,
};
