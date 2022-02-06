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

export default React.memo(function DesignerListCard_renewal({
  isPopup = false,
  designerList,
  toggleDesignerList = [],
  likeUserSetData,
  onLike = () => {},
  onViewMore = () => {},
}) {
  const { user, toggleLikeDesignerSuccess } = useShallowSelector(state => ({
    user: state.user.user,
    toggleLikeDesignerSuccess: state.designer.toggleLikeDesigner.success,
  }));
  const [likeUser, setLikeUser] = useState('');

  useDidUpdateEffect(() => {
    if (toggleLikeDesignerSuccess) {
      likeUserSetData.onChange({ value: likeUser });
      setLikeUser('');
    }
  }, [toggleLikeDesignerSuccess === true]);

  return (
    <Styled.DesignerListCard data-component-name="DesignerListCard">
      <IntervalGrid width="1208" className="designerListCard__container">
        {designerList?.map((item, index) => {
          // console.log(item.profileImg, 'item.profileImg');
          const profileImg = item.profileImg ? item.profileImg : icon_face;
          if (item.userCode === user?.userCode) return null;
          return (
            <Grid item xs={6} className="designerListCard_grid_item" key={item.userCode}>
              <div
                className={cx('designerListCard__wrapper ', {
                  on: toggleDesignerList.includes(item.userCode),
                })}
              >
                <div className="designerListCard__portfolio_wrapper">
                  <UserPortfolioSlick
                    className="designerListCard__portfolio_container"
                    isComment={false}
                    profileData={item}
                    background="light"
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
                      <>
                        {likeUserSetData.value.has(item.userCode) ? (
                          <img src={icon_bookmark_on} />
                        ) : (
                          <img src={icon_bookmark_off} />
                        )}
                      </>
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
                          max={5}
                          size={14}
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
                      <div className="designerListCard__counts_item_label">Done</div>
                      <div className="designerListCard__counts_item_contents">
                        {item.completeCount ? item.completeCount : 0}
                      </div>
                    </div>
                    <div className="designerListCard__counts_item">
                      <div className="designerListCard__counts_item_label">Change</div>
                      <div className="designerListCard__counts_item_contents">
                        {item.changedCount ? item.changedCount : 0}
                      </div>
                    </div>
                    <div className="designerListCard__counts_item">
                      <div className="designerListCard__counts_item_label">Give-up</div>
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
      {designerList.length > 5 ? (
        <div className="designerListCard__viewmore">
          <span onClick={onViewMore}>+ View more</span>
        </div>
      ) : (
        ''
      )}
      {/* <div className="designerListCard__viewmore">
        <span onClick={onViewMore}>+ View more</span>
      </div> */}
    </Styled.DesignerListCard>
  );
});

const Styled = {
  DesignerListCard: styled.div`
    min-height: 1000px;
    .designerListCard_grid_item {
      .designerListCard__wrapper {
        width: 558px;
        /* height: 240px; */
        margin: 24px auto;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border: 1px solid ${color.gray_border2};
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
        background-color: #ffffff;

        .designerListCard__portfolio_wrapper {
          width: 49%;
          height: 240px;
          position: relative;
          padding-right: 35px;
          border-right: 1px dashed #bababa;
          padding-top: 10px;
        }
        .designerListCard__profile_wrapper {
          width: 51%;
          height: 240px;
          padding-left: 35px;
          padding-top: 40px;
          font-size: 13px;
          .designerListCard__info {
            margin-bottom: 20px;
            .designerListCard__info_item {
              display: flex;
              margin-bottom: 10px;
              width: 100%;
              .designerListCard__info_item_label {
                width: 21px;
                margin-right: 15px;
              }
              .designerListCard__info_item_contents {
                line-height: 18px;
              }
            }
          }
          .designerListCard__counts {
            .designerListCard__counts_item {
              display: flex;
              margin-bottom: 10px;
              .designerListCard__counts_item_label {
                width: 50px;
                margin-right: 15px;
              }
            }
          }
        }
        .designerListCard__like {
          position: absolute;
          top: 10px;
          right: 35px;
        }
      }
    }
    .designerListCard__viewmore {
      padding: 25px 0 40px 0;
      text-align: center;
      span {
        font-size: 19px;
        color: #00a6e2;
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }
    }
  `,
};
