import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import { icon_user_circle } from 'components/base/images';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import { useShallowSelector } from 'lib/utils';
import { UserActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { addCommas } from 'lib/library';
import CustomSpan from 'components/common/text/CustomSpan';
import ImgCrop from 'components/common/images/ImgCrop';
import { useLocation } from 'react-router-dom';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import { color } from 'styles/utils';

export default React.memo(function StoreUserCardContainer({
  parentPath = 'store',
  marginLeft = 0,
  marginRight = 0,
  paddingTop = 30,
}) {
  const { overview, overviewSuccess, fetchSummary, fetchSummarySuccess } = useShallowSelector(
    state => ({
      overview: state.user.overview.data,
      overviewSuccess: state.user.overview.success,
      fetchSummary: state.user.fetchSummary.data,
      fetchSummarySuccess: state.user.fetchSummary.success,
    }),
  );
  const { pathname } = useLocation();
  const lastUrl = pathname.split('/').pop();
  const profile = overview?.profile;
  const summary = fetchSummary?.mySummary;
  const { uid } = useParams();

  useEffect(() => {
    UserActions.fetch_summary_request();
    UserActions.fetch_overview_request();
  }, []);

  const { isFetchSuccess } = useFetchLoading({
    overviewSuccess,
    fetchSummarySuccess,
  });
  if (!isFetchSuccess) return null;
  return (
    <StoreUserCard
      uid={uid}
      profile={profile}
      summary={summary}
      icon_user_circle={icon_user_circle}
      parentPath={parentPath}
      marginLeft={marginLeft}
      marginRight={marginRight}
      paddingTop={paddingTop}
    />
  );
});
export const StoreUserCard = React.memo(
  ({
    uid,
    profile,
    summary,
    icon_user_circle,
    parentPath,
    marginLeft,
    marginRight,
    paddingTop,
  }) => {
    const history = useHistory();
    const { t } = useTranslation();
    return (
      <Styled.StoreUserCard
        data-component-name="StoreUserCard"
        marginLeft={marginLeft}
        marginRight={marginRight}
        paddingTop={paddingTop}
      >
        <section className="storeUserCard__container">
          <div className="storeUserCard__profile_box">
            <figure className="storeUserCard__profile_box">
              {profile.profileImg ? (
                <ImgCrop
                  width={80}
                  height={80}
                  isCircle
                  src={profile.profileImg}
                  className="radius-circle box-shadow-default"
                />
              ) : (
                <img
                  src={icon_user_circle}
                  art="user"
                  width={80}
                  className="radius-circle box-shadow-default"
                />
              )}
            </figure>

            <div className="storeUserCard__profile_name_box">
              <div className="storeUserCard__profile_name">
                <CustomSpan fontSize={15} fontWeight={500}>
                  {!!profile.company ? profile.company : ' '}
                </CustomSpan>
              </div>
              {parentPath !== 'store' && (
                <>
                  <div className="storeUserCard__profile_email">
                    <CustomSpan fontSize={15} fontWeight={400}>
                      {!!profile.email ? profile.email : ' '}
                    </CustomSpan>
                  </div>
                  <div className="storeUserCard__profile_modify">
                    <div
                      className="storeUserCard__profile_modify_button"
                      onClick={() => history.push(`/@${uid}/profile/edit`)}
                    >
                      <PencilUnderlineIcon width={13} color={color.gray_b5} />
                      <div className="storeUserCard__profile_modify_text">
                        <T>GLOBAL_MODIFY</T>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="storeUserCard__profile_table_wrapper">
              <Grid container className="storeUserCard__profile_table_row">
                <Grid item xs={4} className="storeUserCard__profile_table_item">
                  <div>{!!summary.project.inProgress ? summary.project.inProgress : 0}</div>
                  <div>
                    <T>USER_CARD_IN_PROGRESS</T>
                  </div>
                </Grid>
                <Grid item xs={4} className="storeUserCard__profile_table_item">
                  <div>{!!summary.project.completed ? summary.project.completed : 0}</div>
                  <div>
                    <T>USER_CARD_COMPLETED</T>
                  </div>
                </Grid>
                <Grid item xs={4} className="storeUserCard__profile_table_item">
                  <div>{!!summary.project.total ? summary.project.total : 0}</div>
                  <div>
                    <CustomSpan fontWeight={400}>
                      <T>USER_CARD_TOTAL_PROJECT</T>
                    </CustomSpan>
                  </div>
                </Grid>
              </Grid>
              <Grid container className="storeUserCard__profile_table_row">
                <Grid item xs={6} className="storeUserCard__profile_table_item">
                  <div>{!!summary.point.waiting ? addCommas(summary.point.waiting) : 0}</div>
                  <div>
                    <T>USER_CARD_WAITING</T>
                  </div>
                </Grid>
                {/* <Grid item xs={4} className="storeUserCard__profile_table_item">
                  <div>{addCommas(summary.point.completed)}</div>
                  <div>
                    <T>USER_CARD_COMPLETED</T>
                  </div>
                </Grid> */}
                <Grid item xs={6} className="storeUserCard__profile_table_item">
                  <div>{!!summary.point.total ? addCommas(summary.point.total) : 0}</div>
                  <div>
                    <CustomSpan fontWeight={400}>
                      <T>USER_CARD_TOTAL_PAYMENT</T>
                    </CustomSpan>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </section>
      </Styled.StoreUserCard>
    );
  },
);

const Styled = {
  StoreUserCard: styled.section`
    margin-left: ${({ marginLeft }) => marginLeft && `${marginLeft}px`};
    margin-right: ${({ marginRight }) => marginRight && `${marginRight}px`};
    .storeUserCard__container {
      width: 325px;
      background-color: #ffffff;
      border-radius: 10px;
      padding-top: ${({ paddingTop }) => paddingTop && `${paddingTop}px`};
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
    }
    .storeUserCard__profile_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .storeUserCard__profile_name_box {
        width: 100%;
        padding: 20px 0;
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        row-gap: 10px;

        .storeUserCard__profile_name,
        .storeUserCard__profile_email,
        .storeUserCard__profile_modify_button {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .storeUserCard__profile_name,
        .storeUserCard__profile_email {
          /* line-height: 20px; */
          width: 100%;
          height: 20px;
        }

        .storeUserCard__profile_modify {
          margin-top: 5px;
          padding-bottom: 18px;
          .storeUserCard__profile_modify_button {
            display: flex;
            align-items: flex-end;
            &:hover {
              cursor: pointer;
            }
            .storeUserCard__profile_modify_text {
              margin-left: 5px;
              margin-bottom: 1px;
              /* font-size: 10px; */
              font-size: 10pt;
              font-weight: 400;
              color: ${color.gray_b5};
              text-decoration: underline;
              text-decoration-color: ${color.gray_b5};
              /* text-decoration-thickness: 1px; */
            }
          }
        }
      }
      .storeUserCard__profile_table_wrapper {
        width: 100%;
        border: 1px solid #828cb050;
        border-radius: 5px;
        .storeUserCard__profile_table_row {
          &:first-child {
            border-bottom: 1px solid #828cb050;
          }
          .storeUserCard__profile_table_item {
            &:not(first-child) {
              border-left: 1px dashed #bababa42;
            }
            div {
              display: flex;
              align-items: center;
              justify-content: center;
              &:nth-child(1) {
                border-bottom: 1px dashed #bababa42;
                height: 50px;
                font-size: 15px;
                font-weight: 500;
              }
              &:nth-child(2) {
                height: 20px;
                font-size: 10px;
                font-weight: 300;
              }
            }
          }
        }
      }
    }
  `,
};
