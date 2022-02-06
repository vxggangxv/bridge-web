import {
  icon_calendar,
  icon_dollar,
  icon_earth,
  icon_paper_plane,
  icon_tool,
  icon_user_circle,
} from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import CustomSpan from 'components/common/text/CustomSpan';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { beforeDash, color, robotoFont } from 'styles/utils';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import BookmarkIcon from 'components/base/icons/BookmarkIcon';
import MuiButton from 'components/common/button/MuiButton';
import ImgCrop from 'components/common/images/ImgCrop';
import cx from 'classnames';
import moment from 'moment';
import { ProjectContext } from 'contexts/project/ProjectContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { AppActions, DesignerActions, ProjectActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { useParams } from 'react-router';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(function ProjectFinishModalContainer({
  item,
  clientInfo,
  isClient,
  onClose,
}) {
  const { confirmProjectSuccess } = useShallowSelector(state => ({
    confirmProjectSuccess: state.designer.confirmProject.success,
  }));
  // const {
  //   evaluateProjectSuccess,
  //   confirmProjectSuccess,
  //   toggleLikeDesignerSuccess,
  // } = useShallowSelector(state => ({
  //   evaluateProjectSuccess: state.project.evaluateProject.success,
  //   confirmProjectSuccess: state.designer.confirmProject.success,
  //   toggleLikeDesignerSuccess: state.designer.toggleLikeDesigner.success,
  // }));
  const { pcode: projectCode } = useParams();
  const score = useInput(0);
  const likeStatus = useInput(null);

  const opponentProfileImg = isClient ? item.profileImg : clientInfo.profileImg;
  const opponentCompany = isClient ? item.company : clientInfo.company;
  const { cloudFileListCt } = useContext(ProjectContext);

  // SECTION: init
  useEffect(() => {
    // like안 한 디자이너 경우만 표시
    if (!item?.likeStatus) {
      likeStatus.setValue(item?.likeStatus);
    }
  }, [item?.likeStatus]);

  // SECTION: method
  const handleConfirm = useCallback(() => {
    if (score.value === 0)
      return AppActions.show_toast({ type: 'warning', message: 'Please, Evalute the designer.' });

    // console.log('item.designerCode', item.designerCode);
    // console.log('likeStatus', !!likeStatus.value ? 1 : 0);
    // console.log('score.value', score.value);
    // console.log(projectCode);
    // return;

    // like한 상태는 초기값 유지
    if (likeStatus.value !== null) {
      DesignerActions.toggle_like_designer_request({
        designerUserCode: item.designerCode,
        status: !!likeStatus.value ? 1 : 0,
      });
    }

    DesignerActions.confirm_project_request({ projectCode });

    onClose();
  }, [likeStatus.value, score.value, isClient]);

  const handleEvalute = () => {
    ProjectActions.evaluate_project_request({
      projectCode,
      rating: score.value,
    });
  };

  // response api
  useDidUpdateEffect(() => {
    if (confirmProjectSuccess) {
      console.log('confirmProjectSuccess');
      handleEvalute();
    }
  }, [!!confirmProjectSuccess]);

  // useEffect(() => {
  //   AppActions.show_toast({
  //     type: 'warning',
  //     message: 'Please, Evalute the designer.',
  //     isAutoRemove: false,
  //   });
  // }, []);

  // console.log('cloudFileListCt', cloudFileListCt.value);
  // useEffect(() => {
  // }, [cloudFileListCt.value]);

  return (
    <Styled.ProjectFinishModal data-component-name="ProjectFinishModal">
      <div className="projectFinishModal__header">
        <h2>FINISH A PROJECT</h2>
        <h3>Clinic / Lab / Milling Center</h3>
      </div>
      <div className="projectFinishModal__body">
        <div className="projectFinishModal__grid_container">
          <div className="projectFinishModal__grid_item result">
            <div className="projectFinishModal__result_box">
              <div className="projectFinishModal__account_box">
                <figure
                  className={cx('projectFinishModal__thumbnail_figure', {
                    online: !!item.isOnline,
                  })}
                >
                  {item.profileImg ? (
                    <ImgCrop isCircle src={item.profileImg} className="box-shadow-default" />
                  ) : (
                    <img
                      src={icon_user_circle}
                      alt="user"
                      className="box-shadow-default radius-circle"
                      width={'100%'}
                    />
                  )}
                </figure>
                <div className="projectFinishModal__company_container">
                  <div className="projectFinishModal__company_box">
                    <span className="projectFinishModal__company" title={item.company}>
                      {item.company}
                    </span>
                    {!!item.isInvite && (
                      <img
                        src={icon_paper_plane}
                        alt="airplain"
                        className="projectFinishModal__airplain_icon"
                      />
                    )}
                  </div>
                  <div className="projectFinishModal__score">
                    <StarScore score={item.grade} size={11} gutter={3} hideText={true} />
                  </div>
                </div>
              </div>
              <div className="hr-reset projectFinishModal__info_division"></div>
              <div className="projectFinishModal__info_box">
                <div className="projectFinishModal__info_item">
                  <img src={icon_tool} alt="tool" className="projectFinishModal__info_img" />
                  <span className="projectFinishModal__info_text">{item.program}</span>
                </div>
                <div className="projectFinishModal__info_item">
                  <img src={icon_dollar} alt="dollar" className="projectFinishModal__info_img" />
                  <span className="projectFinishModal__info_text">{item.workPoint} $</span>
                </div>
                <div className="projectFinishModal__info_item">
                  <img src={icon_earth} alt="earth" className="projectFinishModal__info_img" />
                  <span className="projectFinishModal__info_text">{item.languageGroup}</span>
                </div>
                <div className="projectFinishModal__info_item">
                  <img
                    src={icon_calendar}
                    alt="calendar"
                    className="projectFinishModal__info_img"
                  />
                  <span className="projectFinishModal__info_text">
                    {moment.unix(item.deliveryDate).format('YY-MM-DD')},{' '}
                    {moment.unix(item.deliveryDate).format('HH:mm')}
                  </span>
                </div>
              </div>
            </div>

            {!!cloudFileListCt.value.length && (
              <TableContainer className="projectFinishModal__file_table_container">
                <Table stickyHeader className="projectFinishModal__file_table">
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell align="center">Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cloudFileListCt.value.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.originName}</TableCell>
                        <TableCell align="center">{item.extension?.substr(1)}</TableCell>
                      </TableRow>
                    ))}
                    {/* {Array.from({ length: 50 }).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>Origin</TableCell>
                        <TableCell>Extension</TableCell>
                      </TableRow>
                    ))} */}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>

          <div className="projectFinishModal__grid_item confirm">
            <div className="projectFinishModal__confirm_box">
              {/* <h3 className="projectFinishModal__confirm_title">Confirm {isClient && '& Pay'}</h3> */}
              <h3 className="projectFinishModal__confirm_title">
                {isClient ? <T>PROJECT_CONFIRM_AND_PAY</T> : <T>PROJECT_CONFIRM</T>}
              </h3>
              {isClient && (
                <div className="projectFinishModal__confirm_content">
                  <p className="projectFinishModal__confirm_text">
                    {/* Would you like to pay{' '} */}
                    <T>PROJECT_PAYMENT_PAY_QUESTION</T>{' '}
                    <CustomSpan fontColor={color.blue}>{item.company}</CustomSpan>,{' '}
                    <CustomSpan fontColor={color.blue}>
                      {item.workPoint}
                      <T>GLOBAL_POINTS</T>
                    </CustomSpan>
                    ?
                    {/* <CustomSpan fontColor={color.blue}>{item.company}</CustomSpan>{' '}
                    <CustomSpan fontColor={color.navy_blue}>{item.workPoint}</CustomSpan>{' '} points? */}
                    {/* <CustomSpan fontColor={color.blue}>{item.workPoint}</CustomSpan> points to the{' '}
                    <CustomSpan fontColor={color.blue}>{item.company}</CustomSpan>{' '} */}
                  </p>
                  <p className="projectFinishModal__confirm_comment">
                    {/* If you pay points, you can download the result,
                    <br /> The results cannot be reversed. */}
                    <T>PROJECT_PAYMENT_PAY_ALERT</T>
                  </p>
                </div>
              )}
            </div>

            <div className="projectFinishModal__evalute_box">
              <h3 className="projectFinishModal__evalute_title">
                {/* {isClient ? 'Designer' : 'Client'} evaluation */}
                {isClient ? <T>PROJECT_EVALUATE_DESIGNER</T> : <T>PROJECT_EVALUATE_CLIENT</T>}
                <div className="projectFinishModal__evalute_comment">
                  <ErrorOutlineOutlinedIcon fontSize="inherit" htmlColor="inherit" />
                  <CustomSpan marginLeft={5}>
                    {/* Please check the score of the project {isClient ? 'designer' : 'client'}. */}
                    {isClient ? (
                      <T>PROJECT_PAYMENT_DESIGNER_EVALUATE</T>
                    ) : (
                      <T>PROJECT_PAYMENT_CLIENT_EVALUATE</T>
                    )}
                  </CustomSpan>
                </div>
              </h3>
              <div className="projectFinishModal__evalute_content">
                <div className="projectFinishModal__evalute_account_box">
                  <figure className="projectFinishModal__evalute_thumbnail_figure">
                    {opponentProfileImg ? (
                      <ImgCrop isCircle src={opponentProfileImg} className="box-shadow-default" />
                    ) : (
                      <img
                        src={icon_user_circle}
                        alt="user"
                        className="box-shadow-default radius-circle"
                        width={'100%'}
                      />
                    )}
                  </figure>
                  <span className="projectFinishModal__evalute_company" title={opponentCompany}>
                    {opponentCompany}
                  </span>
                  {isClient && !item?.likeStatus && (
                    <div className="projectFinishModal__evalute_favorite_box">
                      <span
                        className="cursor-pointer"
                        onClick={() => likeStatus.setValue(draft => !draft)}
                      >
                        <BookmarkIcon color={!!likeStatus.value ? color.blue : color.gray_font2} />
                      </span>
                      <div className="projectFinishModal__evalute_comment">
                        <ErrorOutlineOutlinedIcon fontSize="inherit" htmlColor="inherit" />
                        <CustomSpan marginLeft={5}>
                          <T>PROJECT_PAYMENT_DESIGNER_BOOKMARK</T>
                        </CustomSpan>
                      </div>
                    </div>
                  )}
                </div>
                <div className="projectFinishModal__evalute_star_box">
                  <StarScore max={5} score={score} size={23} gutter={5} isEdit hideText />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="projectFinishModal__footer">
        <MuiButton disableElevation variant="outlined" onClick={onClose}>
          <T>GLOBAL_CANCEL</T>
        </MuiButton>
        <MuiButton
          disableElevation
          variant="contained"
          disabled={score.value === 0}
          color="primary"
          onClick={() => {
            if (isClient) {
              handleConfirm();
            } else {
              handleEvalute();
            }
          }}
        >
          <T>GLOBAL_OK</T>
        </MuiButton>
      </div>
    </Styled.ProjectFinishModal>
  );
});

const Styled = {
  ProjectFinishModal: styled.div`
    .projectFinishModal__header {
      position: relative;
      margin: 70px 0;
      width: 1142px;
      height: 120px;
      padding-left: 60px;
      background-color: #00a6e2;
      border-radius: 0 205px 205px 0;
      font-family: ${robotoFont};
      h2 {
        position: relative;
        left: -5px;
        font-size: 53px;
        font-weight: 700;
        line-height: 70px;
        color: #ffffff;
        padding-top: 8px;
        letter-spacing: -1.2px;
      }
      h3 {
        font-size: 25px;
        line-height: 33px;
        color: #ffffff;
        letter-spacing: -0.3px;
      }
    }
    .projectFinishModal__body {
      padding: 0px 60px 10px;
      .projectFinishModal__grid_container {
        display: flex;
        .projectFinishModal__grid_item {
          &.result {
            /* width: 615px; */
            width: 50%;
            padding-right: 40px;
            border-right: 1px dashed ${color.gray_border2};
          }
          &.confirm {
            /* width: 465px; */
            width: 50%;
          }
        }
      }
      .projectFinishModal__grid_item.result {
        .projectFinishModal__result_box {
          display: flex;
          align-items: center;
          .projectFinishModal__account_box {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 205px;
            padding-right: 15px;
            .projectFinishModal__thumbnail_figure {
              position: relative;
              width: 34px;
              height: 34px;
              &:after {
                content: '';
                position: absolute;
                top: 1px;
                right: 1px;
                display: block;
                width: 8px;
                height: 8px;
                background-color: ${color.gray_week_font};
                border-radius: 50%;
              }
              &.online {
                &:after {
                  background-color: ${color.blue};
                }
              }
            }
            .projectFinishModal__company_container {
              margin-left: 10px;
              width: 105px;
              font-size: 12px;
              .projectFinishModal__company_box {
                position: relative;
                display: flex;
                align-items: center;
                .projectFinishModal__company {
                  max-width: calc(100% - 15px);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .projectFinishModal__airplain_icon {
                  width: 11px;
                  margin-left: 4px;
                }
              }
              .projectFinishModal__score {
                margin-top: 5px;
              }
            }
          }
          .projectFinishModal__info_box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            border-left: 1px dashed ${color.gray_border2};
            padding-left: 30px;
            font-size: 13px;
            width: 410px;
            .projectFinishModal__info_item {
              display: flex;
              align-items: center;
              padding-right: 10px;
              &:nth-child(2) ~ .projectFinishModal__info_item {
                margin-top: 10px;
              }
              &:nth-child(1),
              &:nth-child(3) {
                width: 43%;
              }
              &:nth-child(2),
              &:nth-child(4) {
                width: 57%;
              }
              .projectFinishModal__info_img {
                width: 16px;
                margin-right: 10px;
              }
              .projectFinishModal__info_text {
              }
            }
          }
        }
        .projectFinishModal__file_table_container {
          margin-top: 30px;
          max-height: 250px;
          .projectFinishModal__file_table {
            table-layout: fixed;
            border-collapse: separate;
            border: 1px solid ${color.gray_border};
            border-top: none;
            border-radius: 5px;
            th,
            td {
              padding: 10px;
              border-color: ${color.gray_border};
              line-height: 1.3;
              &:nth-child(1) {
                width: 80%;
              }
              &:nth-child(2) {
                width: 20%;
              }
            }
            thead {
              th {
                background-color: #fff;
                border-top: 1px solid ${color.gray_border};
                &:not(:first-child) {
                  border-left: 1px solid ${color.gray_border};
                }
                &:first-child {
                  border-top-left-radius: 5px;
                }
                &:last-child {
                  border-top-right-radius: 5px;
                }
              }
            }
            tbody {
              tr {
                td {
                  border-bottom: none;
                }
                /* &:last-child {
                  td {
                    border-bottom: none;
                  }
                } */
              }
            }
          }
        }
      }
      .projectFinishModal__grid_item.confirm {
        padding-left: 40px;
        .projectFinishModal__confirm_box {
          .projectFinishModal__confirm_title {
            position: relative;
            left: -40px;
            ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 19 })};
            margin-bottom: 25px;
          }
          .projectFinishModal__confirm_content {
            margin-bottom: 60px;
            .projectFinishModal__confirm_text {
              font-size: 16px;
            }
            .projectFinishModal__confirm_comment {
              margin-top: 15px;
              font-size: 14px;
              color: ${color.gray_font2};
              line-height: 1.5;
            }
          }
        }
        .projectFinishModal__evalute_box {
          font-size: 16px;
          .projectFinishModal__evalute_comment {
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
            color: ${color.gray_font2};
          }
          .projectFinishModal__evalute_title {
            display: flex;
            align-items: center;
          }
          .projectFinishModal__evalute_content {
            margin-top: 25px;
            .projectFinishModal__evalute_account_box {
              display: flex;
              align-items: center;
              .projectFinishModal__evalute_thumbnail_figure {
                width: 34px;
                height: 34px;
              }
              .projectFinishModal__evalute_company {
                font-size: 12px;
                width: 100px;
                margin-left: 10px;
                margin-right: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .projectFinishModal__evalute_favorite_box {
                display: flex;
                align-items: center;
              }
            }
          }
        }
        .projectFinishModal__evalute_star_box {
          margin-top: 15px;
        }
      }
    }
    .projectFinishModal__footer {
      display: flex;
      justify-content: space-between;
      padding: 35px 60px;
      .button {
        min-width: 155px;
      }
    }
  `,
};
