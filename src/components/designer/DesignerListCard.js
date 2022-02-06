import { Grid } from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarScore from 'components/common/score/StarScore';
import { color } from 'styles/utils';
import {
  icon_face,
  icon_starscore,
  icon_earth,
  icon_bookmark_on,
  icon_bookmark_off,
} from 'components/base/images';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { pageUrl } from 'lib/mapper';
import cx from 'classnames';
import UserPortfolioSlick from 'components/common/swiper/UserPortfolioSlick';
import BookmarkIcon from 'components/base/icons/BookmarkIcon';
import T from 'components/common/text/T';

export default React.memo(function DesignerListCard({
  className,
  isPopup = false,
  designerList,
  toggleDesignerList = [],
  likeUserSetData,
  onLike = () => {},
}) {
  const { user, toggleLikeDesignerSuccess } = useShallowSelector(state => ({
    user: state.user.user,
    toggleLikeDesignerSuccess: state.designer.toggleLikeDesigner.success,
  }));
  const [likeUser, setLikeUser] = useState('');

  useDidUpdateEffect(() => {
    if (toggleLikeDesignerSuccess) {
      // console.log('likeUser', likeUser);
      likeUserSetData.onChange({ value: likeUser });
      setLikeUser('');
    }
  }, [toggleLikeDesignerSuccess === true]);

  return (
    <Styled.DesignerListCard data-component-name="DesignerListCard">
      <IntervalGrid width={1110} padding={25} hasPaddingGridContainer={false} className={className}>
        {designerList?.map((item, index) => {
          // console.log(item.profileImg, 'item.profileImg');
          const profileImg = item.profileImg ? item.profileImg : icon_face;
          if (item.userCode === user?.userCode) return null;
          return (
            <Grid item xs={6} className="designerListCard_grid_item" key={item.userCode}>
              <div
                className={cx('designerListCard__card ', {
                  on: toggleDesignerList.includes(item.userCode),
                })}
              >
                <div className="designerListCard__portfolio_wrapper">
                  <UserPortfolioSlick
                    className="designerListCard__portfolio_container"
                    isComment={false}
                    profileData={item}
                    backgroundColor="light"
                    width={225}
                  />
                  <span
                    className="designerListCard__like cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      onLike({ status: item.likeStatus, designerUserCode: item.userCode });
                      setLikeUser(item.userCode);
                    }}
                  >
                    {!isPopup && (
                      <BookmarkIcon
                        color={
                          likeUserSetData.value.has(item.userCode) ? color.blue : color.gray_font2
                        }
                      />
                    )}
                  </span>
                </div>

                <div className="designerListCard__profile_wrapper">
                  <div className="designerListCard__info">
                    <div className="designerListCard__info_item starscore">
                      <div className="designerListCard__info_item_label">
                        <img src={icon_starscore} />
                      </div>

                      <div className="designerListCard__info_item_contents">
                        <StarScore
                          hideText={true}
                          size={14}
                          gutter={3}
                          score={item.grade}
                          className="designerListCard__info_item_contents_score"
                        />
                      </div>
                    </div>
                    {/* <div className="designerListCard__info_item">
                      <div className="designerListCard__info_item_label">
                        <img src={icon_program} />
                      </div>
                      <div className="designerListCard__info_item_contents">
                        EXO CAD, 3 shape, Cerec AAAAAAA BBBB
                      </div>
                    </div> */}
                    <div className="designerListCard__info_item ">
                      <div className="designerListCard__info_item_label">
                        <img src={icon_earth} />
                      </div>
                      <div className="designerListCard__info_item_contents">
                        {item.languageGroup ? item.languageGroup : ''}
                      </div>
                    </div>
                  </div>
                  <div className="designerListCard__counts">
                    <div className="designerListCard__counts_item">
                      <div className="designerListCard__counts_item_label">
                        <T>GLOBAL_COMPLETED</T>
                      </div>
                      <div className="designerListCard__counts_item_contents">
                        {item.completeCount ? item.completeCount : 0}
                      </div>
                    </div>
                    <div className="designerListCard__counts_item">
                      <div className="designerListCard__counts_item_label">
                        <T>GLOBAL_REJECTED</T>
                      </div>
                      <div className="designerListCard__counts_item_contents">
                        {item.changedCount ? item.changedCount : 0}
                      </div>
                    </div>
                    <div className="designerListCard__counts_item">
                      <div className="designerListCard__counts_item_label">
                        <T>DESIGNER_DROPPED</T>
                      </div>
                      <div className="designerListCard__counts_item_contents">
                        {item.giveupCount ? item.giveupCount : 0}
                      </div>
                    </div>
                  </div>
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
    /* min-height: 900px; */
    .designerListCard_grid_item {
      &:nth-child(2) ~ .designerListCard_grid_item {
        margin-top: -15px;
      }
      .designerListCard__card {
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
        border: 1px solid ${color.gray_border2};
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
        background-color: #ffffff;

        > [class*='_wrapper'] {
          width: 50%;
          height: 100%;
        }
        .designerListCard__portfolio_wrapper {
          position: relative;
          padding-right: 30px;
          border-right: 1px dashed ${color.gray_border2};
          /* padding-top: 10px; */
        }
        .designerListCard__like {
          position: absolute;
          top: 0px;
          right: 30px;
        }
        .designerListCard__profile_wrapper {
          padding-left: 30px;
          padding-top: 30px;
          font-size: 13px;
          .designerListCard__info {
            margin-bottom: 20px;
            .designerListCard__info_item {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              width: 100%;
              .designerListCard__info_item_label {
                min-width: 35px;
              }
              .designerListCard__info_item_contents {
              }
            }
          }
          .designerListCard__counts {
            .designerListCard__counts_item {
              display: flex;
              margin-bottom: 15px;
              .designerListCard__counts_item_label {
                min-width: 70px;
              }
            }
          }
        }
      }
    }
  `,
};
