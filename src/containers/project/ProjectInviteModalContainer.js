import React, { useEffect, useState, useContext, useMemo } from 'react';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import styled from 'styled-components';
import {
  matching_illust,
  icon_bookmark_on,
  icon_bookmark_off,
  default_designer,
} from 'components/base/images';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { color, robotoFont } from 'styles/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import cx from 'classnames';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import UserProfilePagingSlick from 'components/common/swiper/UserProfilePagingSlick';
import StarScore from 'components/common/score/StarScore';
import MuiButton from 'components/common/button/MuiButton';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, DesignerActions } from 'store/actionCreators';
import ImgCrop from 'components/common/images/ImgCrop';
import queryString from 'query-string';
import ViewMore from 'components/common/pagination/ViewMore';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

export default function ProjectInviteModalContainer({ onClose }) {
  const {
    // designerListData,
    likeDesignerListData,
    fetchLikeDesignersSuccess,
    portfolioData,
    profileData,
    inviteDesignerSuccess,
  } = useShallowSelector(state => ({
    likeDesignerListData: state.designer.likeDesigners.data,
    fetchLikeDesignersSuccess: state.designer.likeDesigners.success,
    portfolioData: state.designer.portfolio.data,
    profileData: state.designer.profile.data,
    inviteDesignerSuccess: state.designer.inviteDesigner.success,
  }));

  const { pcode } = useParams();
  // const { search } = useLocation();
  // const queryParse = queryString.parse(search);
  // const projectCode = queryParse?.projectCode;
  const projectCode = pcode;

  const designerList = likeDesignerListData?.likeDesignerList;
  const pagingData = likeDesignerListData?.pagingData;
  const portfolioList = portfolioData?.list;
  const profileDataData = profileData?.profileData;
  const [designerListDataStack, setDesignerListDataStack] = useState([]);
  const designerCode = useInput('');
  const checkBoxChecked = useCheckSetInput(new Set([]));

  const page = useInput(1);
  const isMaxCurrentPage = page.value === pagingData?.totalPage;
  // console.log('projectCode ---> ', projectCode);

  // SECTION: init load designer list
  useEffect(() => {
    DesignerActions.fetch_like_designers_request({ projectCode, page: page.value });
  }, []);

  useEffect(() => {
    console.log('profileDataData  ___  ', profileDataData);
  }, []);

  // page.value 별도 onChange 처리, 1은 예외
  useDidUpdateEffect(() => {
    if (page.value === 1) return;
    DesignerActions.fetch_like_designers_request({ projectCode, page: page.value });
  }, [page.value]);

  useDidUpdateEffect(() => {
    if (fetchLikeDesignersSuccess) {
      if (page.value === 1) {
        setDesignerListDataStack(designerList);
      } else {
        setDesignerListDataStack(draft => [...draft, ...designerList]);
      }
    }
  }, [fetchLikeDesignersSuccess === true, page.value]);

  useDidUpdateEffect(() => {
    if (designerList.length > 0 && page.value < 2) {
      designerCode.setValue(designerList[0].userCode);
    }
  }, [designerList]);

  useDidUpdateEffect(() => {
    DesignerActions.fetch_portfolio_request({ userCode: designerCode.value });
    DesignerActions.fetch_profile_request({ userCode: designerCode.value });
  }, [designerCode]);

  const handleInvite = () => {
    if (!checkBoxChecked.value.size)
      return AppActions.show_toast({ type: 'error', message: 'Please, Select options' });

    const selectDesignerList = [...checkBoxChecked.value];
    const submitData = {
      projectCode,
      selectDesignerList: selectDesignerList,
    };

    // console.log('send ------ ', submitData);
    DesignerActions.invite_designer_request(submitData);
  };

  useDidUpdateEffect(() => {
    if (inviteDesignerSuccess) onClose();
  }, [!!inviteDesignerSuccess]);

  // const handleViewMore = () => {
  //   const nextPage = page.value + 1;
  //   if (nextPage > pagingData.totalPage) return;
  //   DesignerActions.fetch_like_designers_request({ projectCode, page: nextPage });
  //   page.setValue(nextPage);
  // };

  return (
    <ProjectInviteModal
      designerListDataStack={designerListDataStack}
      isMaxCurrentPage={isMaxCurrentPage}
      portfolioList={portfolioList}
      profileDataData={profileDataData}
      designerCode={designerCode}
      checkBoxChecked={checkBoxChecked}
      page={page}
      pagingData={pagingData}
      onInvite={handleInvite}
      onClose={onClose}
    />
  );
}

export const ProjectInviteModal = React.memo(function ProjectInviteModal({
  designerListDataStack,
  isMaxCurrentPage,
  portfolioList,
  profileDataData,
  designerCode,
  checkBoxChecked,
  page,
  pagingData,
  onInvite = () => {},
  onClose = () => {},
}) {
  const { t } = useTranslation();
  return (
    <Styled.ProjectInviteModal data-component-name="ProjectInviteModal">
      <div className="projectInviteModal__header">
        <h2>
          <T>Create a Project</T>
        </h2>
        <h3>
          <T>GLOBAL_CLINIC</T> / <T>GLOBAL_LAB</T> / <T>GLOBAL_MILLING</T>
        </h3>
        <img src={matching_illust} />
      </div>
      <div className="projectInviteModal__body">
        <div className="projectInviteModal__content_wrapper">
          <div className="projectDesignerThumbnail_container">
            <div className="projectDesignerThumbnail__designer_info_box">
              <div
                className={cx('projectDesignerThumbnail__designer_img_box_wrapper', {
                  online: !!profileDataData?.isOnline,
                })}
              >
                <div className="projectDesignerThumbnail__designer_img_box">
                  {profileDataData?.profileImg ? (
                    <ImgCrop
                      isCircle
                      className="box-shadow-default"
                      src={profileDataData.profileImg}
                    />
                  ) : (
                    <img className="box-shadow-default radius-circle" src={default_designer} />
                  )}
                </div>
              </div>
              <div className="projectDesignerThumbnail__designer_id">
                <span>{profileDataData && profileDataData.company}</span>
              </div>
            </div>
            <div className="projectDesignerThumbnail__designer_slick">
              {portfolioList?.length > 0 ? (
                <UserProfilePagingSlick
                  portfolioList={portfolioList}
                  height={340}
                  pagerAbsolute={true}
                />
              ) : (
                <div className="designerPortfolio__slider_box"></div>
              )}
            </div>
            <div className="projectDesignerThumbnail__designer_textBox"></div>
          </div>

          <div className="projectDesignerList__container">
            <TableContainer className="projectDesignerList__table_container">
              <Table
                aria-label="projectDesignerList file table"
                className="projectDesignerList__table"
              >
                <TableHead className="projectDesignerList__table_head">
                  <TableRow>
                    <TableCell className="projectDesignerList__table_cell checkbox"></TableCell>
                    <TableCell className="projectDesignerList__table_cell id">
                      <T>GLOBAL_ID</T>
                    </TableCell>
                    <TableCell className="projectDesignerList__table_cell bookmark"></TableCell>
                    <TableCell className="projectDesignerList__table_cell language">
                      <T>GLOBAL_LANGUAGE</T>
                    </TableCell>
                    <TableCell className="projectDesignerList__table_cell done">
                      <T>GLOBAL_COMPLETED</T>
                    </TableCell>
                    <TableCell className="projectDesignerList__table_cell change">
                      <T>GLOBAL_REJECTED</T>
                    </TableCell>
                    <TableCell className="projectDesignerList__table_cell giveup">
                      <T>GLOBAL_DROPPED</T>
                    </TableCell>
                    <TableCell className="projectDesignerList__table_cell etc "></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="projectDesignerList__table_body">
                  {designerListDataStack?.length > 0 &&
                    designerListDataStack.map((designer, i) => (
                      <TableRow
                        className="projectDesignerList__table_body_row"
                        key={i}
                        onClick={() => {
                          designerCode.setValue(designer.userCode);
                        }}
                      >
                        <TableCell className="projectDesignerList__table_cell checkbox">
                          <MuiWrapper>
                            <Checkbox
                              name={designer.userCode}
                              checked={checkBoxChecked.value.has(designer.userCode)}
                              color="primary"
                              onClick={e => {
                                e.stopPropagation();
                                // console.log('checkBoxChecked.value.size', checkBoxChecked.value.size);
                                if (
                                  !checkBoxChecked.value.has(designer.userCode) &&
                                  checkBoxChecked.value.size > 4
                                ) {
                                  return;
                                }
                                checkBoxChecked.onChange({ value: e.target.name });
                                // designerCode.setValue(designer.userCode);
                              }}
                            />
                          </MuiWrapper>
                        </TableCell>
                        <TableCell align="center" className="projectDesignerList__table_cell id">
                          {designer.company}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="projectDesignerList__table_cell bookmark"
                        >
                          <img
                            src={designer.likeStatus === 1 ? icon_bookmark_on : icon_bookmark_off}
                          />
                        </TableCell>
                        <TableCell
                          align="center"
                          className="projectDesignerList__table_cell language"
                        >
                          {designer.languageGroup}
                        </TableCell>
                        <TableCell align="center" className="projectDesignerList__table_cell done">
                          {designer.completeCount ? designer.completeCount : 0}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="projectDesignerList__table_cell change"
                        >
                          {designer.changedCount ? designer.changedCount : 0}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="projectDesignerList__table_cell giveup"
                        >
                          {designer.giveupCount ? designer.giveupCount : 0}
                        </TableCell>
                        <TableCell align="center" className="projectDesignerList__table_cell etc ">
                          <StarScore
                            max={5}
                            score={designer.grade}
                            size={12}
                            className="designerList__profile_score"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <ViewMore count={pagingData?.totalPage} page={page} className="viewMore__container" />

            <div className="projectInviteModal__designer_max">
              <ErrorOutlineOutlinedIcon fontSize="inherit" htmlColor="inherit" />
              <div className="max_designer">
                <T>ALARM_MAX_INVITE_DESIGNER</T>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="projectInviteModal__footer">
        {/* display: flex 사용시 좌우 정렬 justify-content 사용 */}
        <div className="projectInviteModal__footer_btn_box">
          <MuiButton
            fullWidth
            disableElevation
            variant="outlined"
            color="default"
            onClick={onClose}
            className="projectInviteModal__cancel_btn"
          >
            <T>GLOBAL_CANCEL</T>
          </MuiButton>

          <MuiButton
            fullWidth
            disableElevation
            variant="contained"
            color="primary"
            onClick={onInvite}
            className="projectInviteModal__send_btn"
          >
            <T>GLOBAL_SEND</T>
          </MuiButton>
        </div>
      </div>
    </Styled.ProjectInviteModal>
  );
});

const Styled = {
  ProjectInviteModal: styled.div`
    .projectInviteModal__header {
      font-family: ${robotoFont};
      background-color: #00a6e2;
      width: 1142px;
      height: 120px;
      margin-top: 70px;
      margin-bottom: 85px;
      padding-left: 55px;
      border-radius: 0 205px 205px 0;
      position: relative;
      h2 {
        font-size: 53px;
        font-weight: 700;
        line-height: 70px;
        color: ${color.white};
        padding-top: 8px;
        letter-spacing: -1.2px;
        /* padding-left: 61px; */
      }
      h3 {
        font-size: 25px;
        /* font-weight: lighter; */
        line-height: 33px;
        /* padding-left: 61px; */
        color: ${color.white};
        letter-spacing: -0.3px;
      }
      img {
        position: absolute;
        right: 99px;
        top: -27px;
      }
    }
    .projectInviteModal__body {
      display: flex;
    }
    .projectInviteModal__more_btn_box {
      /* margin-top: 21px; */
      padding-top: 21px;
      /* padding-left: 650px; */
      padding-bottom: 27px;
      display: flex;
      align-items: center;
      justify-content: center;

      .projectInviteModal__more_btn {
        &:not(:disabled) {
          color: #00a6e2;
        }
        font-size: 19px;
        text-decoration: underline;
        line-height: 26px;
        height: 26px;
      }
    }
    .projectInviteModal__designer_max {
      padding-left: 22px;
      display: flex;
      color: ${color.gray_week_font};
      align-items: center;
      font-size: 20px;

      .max_designer {
        font-size: 14px;
        line-height: 19px;
        padding-left: 11px;
      }
    }
    .projectInviteModal__footer {
      .projectInviteModal__footer_btn_box {
        display: flex;
        justify-content: flex-end;
        padding-right: 55px;
        padding-top: 30px;
        padding-bottom: 30px;
        .projectInviteModal__cancel_btn {
          width: 157px;
          /* color: #bababa; */
        }
        .projectInviteModal__send_btn {
          width: 157px;
          margin-left: 20px;
        }
      }
    }

    .projectInviteModal__content_wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-left: 40px;
      padding-right: 55px;
    }
    .projectDesignerThumbnail_container {
      width: 260px;
      height: 425px;
      background-color: #f2f2f2;
      border-radius: 5px;
      padding: 20px 20px 30px 20px;
      .projectDesignerThumbnail__designer_info_box {
        padding-bottom: 11px;
        position: relative;
        .projectDesignerThumbnail__designer_img_box_wrapper {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          .projectDesignerThumbnail__designer_img_box {
            width: 59px;
            height: 59px;
            margin-top: 2px;
            border-radius: 50%;
            /* box-shadow: 0px 0px 3px 3px rgba(158, 158, 158, 0.1); */
            background-color: ${color.white};
            overflow: hidden;
            img {
              width: 100%;
            }
          }
          &:after {
            content: '';
            position: absolute;
            top: 0px;
            /* left: 1px; */
            left: 0px;
            display: block;
            width: 15px;
            height: 15px;
            background-color: ${color.gray_week_font};
            border-radius: 50%;
          }
          &.online {
            &:after {
              background-color: #00ff11;
              /* background-color: ${color.blue}; */
            }
          }
        }
        .projectDesignerThumbnail__designer_id {
          min-height: 20px;
          height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 68px;
          font-size: 15px;
        }
      }
      .projectDesignerThumbnail__designer_slick {
        width: 220px;
        overflow: hidden;
        .designerPortfolio__slider_box {
          width: 100%;
          height: 150px;
          background-color: ${color.white};
          border-radius: 5px;
        }
      }
      .projectDesignerThumbnail__designer_textBox {
        margin-top: 15px;
        height: 136px;
        overflow-y: scroll;
        font-size: 13px;
      }
    }
    .projectDesignerList__container {
      width: 800px;

      .projectDesignerList__table_container {
        height: 425px;
        overflow-y: scroll;
        .projectDesignerList__table {
          table-layout: fixed;
          border-collapse: separate;
          .projectDesignerList__table_head {
            .projectDesignerList__table_cell {
              z-index: 2;
              position: sticky;
              top: 0;
              left: 0;
              background-color: ${color.white};
              padding: 0 0 15px;
            }
          }
          .projectDesignerList__table_body {
            .projectDesignerList__table_body_row {
              cursor: pointer;
              &:hover {
                cursor: pointer;
                background-color: #f0f7fb;
              }
            }
            .projectDesignerList__table_cell {
              padding: 10px 0;
              &.checkbox {
                padding-top: 6px;
                padding-left: 11px;
                padding-bottom: 8px;
              }
              &.bookmark {
                img {
                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
          }
          .projectDesignerList__table_cell {
            border-bottom: 1px dotted #bababa;

            &.checkbox {
              width: 7%;
            }
            &.id {
              width: 24%;
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &.bookmark {
              line-height: 0;
              width: 2%;
              text-align: center;
            }
            &.language {
              width: 15%;
              text-align: center;
            }
            &.done {
              width: 11%;
              text-align: center;
            }
            &.change {
              width: 11%;
              text-align: center;
            }
            &.giveup {
              width: 11%;
              text-align: center;
            }
            &.etc {
              width: 19%;
              text-align: center;
            }
          }
        }
      }
    }
    .viewMore__container {
      padding: 20px 0 25px;
    }
  `,
};
