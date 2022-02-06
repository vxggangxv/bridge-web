import { Grid } from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import ImgCrop from 'components/common/images/ImgCrop';
import StarScore from 'components/common/score/StarScore';
import { color } from 'styles/utils';
import { icon_face } from 'components/base/images';
import { useShallowSelector } from 'lib/utils';
import { pageUrl } from 'lib/mapper';
import cx from 'classnames';

export default React.memo(function DesignerListCard({
  isPopup = false,
  designerList,
  toggleDesignerList = [],
  onLike = () => {},
  onToggleCard = () => {},
}) {
  const { user } = useShallowSelector(state => ({
    user: state.user.user,
  }));
  const history = useHistory();

  return (
    <Styled.DesignerListCard data-component-name="DesignerListCard">
      <IntervalGrid padding={10} className="designerList__card_container">
        {designerList?.map((item, index) => {
          // console.log(item.profileImg, 'item.profileImg');
          const profileImg = item.profileImg ? item.profileImg : icon_face;
          if (item.userCode === user?.userCode) return null;
          return (
            <Grid item xs={3} className="designerList__card_grid_item" key={item.userCode}>
              <div
                className={cx('designerList__card cursor-pointer', {
                  on: toggleDesignerList.includes(item.userCode),
                })}
                onClick={() => {
                  onToggleCard(item.userCode);
                  if (!isPopup) history.push(`${pageUrl.designer.index}/@${item.userCode}`);
                }}
              >
                <span
                  className="designerList__card_like cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    onLike({ status: item.likeStatus, designerUserCode: item.userCode });
                  }}
                >
                  {!isPopup && (
                    <>
                      {item.likeStatus ? (
                        <FavoriteRoundedIcon htmlColor={color.red} fontSize="inherit" />
                      ) : (
                        <FavoriteBorderRoundedIcon htmlColor={color.red} fontSize="inherit" />
                      )}
                    </>
                  )}
                </span>

                <figure className="designerList__card_face">
                  <ImgCrop width={100} height={100} isCircle src={profileImg} />
                </figure>
                <div className="designerList__card_info">
                  <p className="designerList__card_name">{item.company}</p>
                  <StarScore max={5} score={item.grade} className="designerList__card_score" />
                </div>
              </div>
            </Grid>
          );
        })}
      </IntervalGrid>
    </Styled.DesignerListCard>
  );
});

const Styled = {
  DesignerListCard: styled.div`
    .designerList__card_container {
    }
    .designerList__card_grid_item {
    }
    .designerList__card {
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid ${color.gray_border2};
      width: 100%;
      height: 180px;
      padding: 40px;
      padding-right: 20px;
      &.on {
        border: 2px solid ${color.red} !important;
      }
      .designerList__card_like {
        position: absolute;
        top: 17px;
        right: 17px;
        font-size: 28px;
      }
      .designerList__card_face {
        /* width: 100px;
        height: 100px;
        background-color: #596CB9;
        border-radius: 50%; */
      }
      .designerList__card_info {
        margin-left: 20px;
        width: 160px;
        .designerList__card_name {
          font-size: 20px;
          font-weight: 700;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .designerList__card_score {
          margin-top: 10px;
        }
      }
    }
  `,
};

/* <IntervalGrid
  width={1260}
  padding={10}
  hasPaddingGridContainer={false}
  className="designerList__card_container"
> */
/* <IntervalGrid
  padding={10}
  hasPaddingGridContainer={false}
  className="designerList__card_container"
> */
