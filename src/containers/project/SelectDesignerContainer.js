import { Grid } from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { color, paper, paperSubtitle, opensansFont } from 'styles/utils';
import T from 'components/common/text/T';
import {
  icon_paper_plane,
  icon_user_circle,
  icon_tool,
  icon_earth,
  icon_dollar,
  icon_calendar,
} from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import { ArrowForwardIosRounded } from '@material-ui/icons';
import { AppActions, DesignerActions, ProjectActions } from 'store/actionCreators';
import { useHistory, useLocation, useParams } from 'react-router';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import ImgCrop from 'components/common/images/ImgCrop';
import moment from 'moment';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { pageUrl, projectEmptyMatchingStatus } from 'lib/mapper';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import MuiButton from 'components/common/button/MuiButton';
import useInput from 'lib/hooks/useInput';
import useImmerInput from 'lib/hooks/useImmerInput';
import Color from 'color';
import _ from 'lodash';
import ProjectInviteModalContainer from './ProjectInviteModalContainer';
import PlainModal from 'components/common/modal/PlainModal';
import queryString from 'query-string';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import AttendingDesignerCard from 'components/project/AttendingDesignerCard';
import { AppContext } from 'contexts/AppContext';
import { useTranslation } from 'react-i18next';
import CustomTooltip from 'components/common/tooltip/CustomTooltip';

export default React.memo(({}) => {
  const {
    user,
    projectData,
    attendDesignerList,
    fetchAttendDesignersSuccess,
    // likeDesignerList,
    deleteProjectSuccess,
    deleteProjectFailure,
  } = useShallowSelector(state => ({
    user: state.user.user,
    projectData: state.project.project.data,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
    fetchAttendDesignersSuccess: state.designer.attendDesigners.success,
    // likeDesignerList: state.designer.likeDesigners.data?.likeDesignerList,
    deleteProjectSuccess: state.project.deleteProject.success,
    deleteProjectFailure: state.project.deleteProject.failure,
  }));
  const { t } = useTranslation();
  const { pcode: projectCode } = useParams();
  const history = useHistory();
  // const { search } = useLocation();
  // const queryParse = queryString.parse(search);
  // const queryProjectCode = queryParse?.projectCode;
  // const projectCode = queryProjectCode;
  // DetailContext state
  const { projectStatus } = useContext(ProjectSocketContext);
  const isProjectExpired = projectStatus === projectEmptyMatchingStatus.expired;

  // select parsing state - pushOrder, pushTerm
  const pushTermList = useImmerInput([
    {
      id: 1,
      pushTerm: 30,
    },
    {
      id: 2,
      pushTerm: 30,
    },
    {
      id: 3,
      pushTerm: 30,
    },
  ]);
  const selectDesignerList = useInput([]); // {id, userCode, pushOrder, pushTerm}

  // SECTION: init request
  // useEffect(() => {
  //   DesignerActions.fetch_attend_designers_request({ projectCode });
  //   return () => {
  //     DesignerActions.fetch_attend_designers_clear();
  //   };
  // }, []);

  // SECTION: onChange
  // pushTerm변경시 selectDesignerList 데이터 매핑
  useDidUpdateEffect(() => {
    selectDesignerList.setValue(draft => {
      return draft.reduce((acc, curr) => {
        const pushTerm = pushTermList.value.find(item => item.id === curr.pushOrder).pushTerm;
        let obj = {
          ...curr,
          pushTerm,
        };
        return _.orderBy(acc.concat(obj), 'pushOrder', 'asc');
      }, []);
    });
  }, [pushTermList.value]);

  // TEST:
  // useEffect(() => {
  //   console.log('selectDesignerList.value', selectDesignerList.value);
  // }, [selectDesignerList.value]);

  // pushTerm변경시 selectDesignerList 데이터 매핑 함수
  const convertSelectDesignerData = useCallback(
    data => {
      const { pushOrder, userCode, company } = data;
      let selectDesignerPushTerm = pushTermList.value.find(item => item.id === pushOrder).pushTerm;
      return { ...data, pushTerm: selectDesignerPushTerm };
    },
    [pushTermList.value],
  );

  // SECTION: method
  const handleClickDesigner = data => {
    const { userCode, company } = data;
    console.log('data', data);
    const maxCount = 3;
    let designerData = {
      pushOrder: 1,
      userCode,
      company,
    };

    // re click
    if (selectDesignerList.value?.some(item => item.userCode === userCode)) {
      selectDesignerList.setValue(draft => draft.filter(item => item.userCode !== userCode));

      // 최대 3개 선택 가능
    } else if (selectDesignerList.value?.length < maxCount) {
      // 최초 클릭, pushOrder 1
      let pushOrder = 1;
      let orderArray = Array.from({ length: maxCount }).map((item, index) => index + 1);
      const pushOrderList = selectDesignerList.value.map(item => item.pushOrder);
      orderArray = orderArray.filter(item => !pushOrderList.includes(item));
      pushOrder = Math.min(...orderArray);
      designerData = {
        ...designerData,
        pushOrder,
      };
      selectDesignerList.setValue(draft => {
        return _.orderBy(draft.concat(convertSelectDesignerData(designerData)), 'pushOrder', 'asc');
      });
    }
  };

  // client select
  const handleSelect = () => {
    // invalid - 1) selectDesignerList length
    const isFailureSubmit = !selectDesignerList.value?.length;
    console.log(isFailureSubmit);
    if (isFailureSubmit) {
      return AppActions.show_toast({ type: 'error', message: t('ALARM_SELECT_OPTION') });
    }

    const submitSelectData = {
      projectCode,
      selectDesignerList: selectDesignerList.value,
    };
    console.log('submitSelectData', submitSelectData);

    const SelectListModalContent = () => {
      return (
        <Styled.SelectListModalContent>
          <ul className="selectList__list">
            {selectDesignerList.value.map((item, index) => (
              <li className="selectList__item" key={index}>
                <span className="selectList__order">{item.pushOrder}</span>
                <span className="selectList__term">{item.pushTerm}</span>
                <span className="selectList__company">{item.company}</span>
              </li>
            ))}
          </ul>
          <div className="selectList__notice">
            {/* Check the designer matching request ranking and waiting time.
            <br />
            Matching requests are sequentially requested according to the set ranking, and after the
            waiting time passes, the next ranking designer The request is passed. */}
            <T>PROJECT_SELECT_DESIGNER_LIST_INFO</T>
          </div>
        </Styled.SelectListModalContent>
      );
    };

    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      // title: <T>global.alert</T>,
      // content: <T>modal.complete</T>,
      // isTitleDefault: true,
      // isContentDefault: true,
      title: 'Matching',
      content: <SelectListModalContent />,
      isTitleDefault: true,
      isContentDefault: true,
      align: ['button.center'],
      onClick() {
        // console.log('submitSelect');
        DesignerActions.select_designer_request(submitSelectData);
      },
    });
  };

  const handleDeleteProject = () => {
    console.log('projcet del --> ', projectCode);
    // request api
    ProjectActions.delete_project_request({
      projectCode,
    });
  };

  useDidUpdateEffect(() => {
    if (deleteProjectSuccess) {
      history.push(`${pageUrl.project.list}`);
    }
    if (deleteProjectFailure) {
      history.goBack();
    }
  }, [!!deleteProjectSuccess, !!deleteProjectFailure]);

  const { isFetchSuccess } = useFetchLoading({ fetchAttendDesignersSuccess });
  return (
    <SelectDesigner
      // isFetchSuccess={isFetchSuccess}
      attendDesignerList={attendDesignerList}
      selectDesignerList={selectDesignerList}
      pushTermList={pushTermList}
      onDeleteProject={handleDeleteProject}
      onClickDesigner={handleClickDesigner}
      onSelect={handleSelect}
    />
  );
});

export const SelectDesigner = React.memo(
  ({
    // isFetchSuccess,
    attendDesignerList,
    selectDesignerList,
    pushTermList,
    onDeleteProject,
    onClickDesigner,
    onSelect,
  }) => {
    const { userCode, projectInfo, fetchProjectSuccess, attendDesignersData } = useShallowSelector(
      state => ({
        userCode: state.user.user?.userCode,
        projectInfo: state.project.project.data?.projectInfo,
        fetchProjectSuccess: state.project.project.success,
        attendDesignersData: state.designer.attendDesigners.data,
      }),
    );
    const history = useHistory();
    const { t } = useTranslation();
    const { pcode: projectCode } = useParams();
    // const senderCode = projectInfo?.senderCode;
    // const stage = projectInfo?.stage;
    // const isClient = userCode === senderCode;
    // const isWaitingClient = isClient && stage === 0;
    //
    const { isProjectClient } = useContext(AppContext);
    // const projectStatus = projectInfo?.projectStatus;
    const { projectStatus } = useContext(ProjectSocketContext);
    const isProjectReject = projectStatus === projectEmptyMatchingStatus.reject;
    const isProjectExpired = projectStatus === projectEmptyMatchingStatus.expired;
    // const isProjectExpired = true;
    const isProjectGiveUp = projectStatus === projectEmptyMatchingStatus.giveUp;
    const isPossibleInvite = !(isProjectReject || isProjectExpired || isProjectGiveUp);
    const attendDesignerItems = _.orderBy(
      attendDesignerList,
      ['isInvite', 'likeStatus'],
      ['desc', 'desc'],
    );
    const isOpenInvitePopup = useInput(false);

    // TODO: 변경 예정 - !!attendDesignerList?.length
    // const attendDesignerListPossibleCount = attendDesignerList?.filter(
    //   item => ![1, 3].includes(item.attendStatus),
    // )?.length;
    const attendDesignerListPossibleCount = useMemo(
      () => attendDesignerList?.length,
      [attendDesignerList],
    );

    useEffect(() => {
      console.log('attendDesignerListPossibleCount', attendDesignerListPossibleCount);
    }, [attendDesignerListPossibleCount]);

    // matchingEmpty Status 팝업
    useEffect(() => {
      // console.log('isProjectClient', isProjectClient);
      // console.log('isProjectReject', isProjectReject);
      // console.log('isProjectExpired', isProjectExpired);
      // console.log('isProjectGiveUp', isProjectGiveUp);
      // console.log('attendDesignerListPossibleCount', attendDesignerListPossibleCount);
      // projectClient이고
      if (fetchProjectSuccess && isProjectClient) {
        // project Reject, Expired 상태
        if (isProjectReject || isProjectExpired) {
          console.log('attendDesignerListPossibleCount', attendDesignerListPossibleCount);
          // AppActions.add_popup({
          //   isOpen: true,
          //   type: 'confirm',
          //   title: 'Alert',
          //   content:
          //     '매칭된 디자이너가 없습니다.\n 디자이너를 다시 초대하거나 프로젝트를 삭제할 수 있습니다.',
          // '매칭된 디자이너가 없습니다.\n 프로젝트를 다시 만들거나 삭제할 수 있습니다.',
          //   isTitleDefault: true,
          //   isContentDefault: true,
          //   okText: 'Reselect',
          //   cancelText: 'Remove',
          //   onCancel() {
          //     ProjectActions.delete_project_request({
          //       projectCode,
          //     });
          //   },
          // });

          AppActions.add_popup({
            isOpen: true,
            type: 'confirm',
            title: 'Alert',
            content: !!attendDesignerListPossibleCount
              ? // ? 'There are no matching designers.\n You can re-invite the designer or delete the project.'
                // : 'There are no matching designers.\n You can recreate or delete the project.',
                t('ALARM_NO_MATCH_DESIGNER_REINVITE')
              : t('ALARM_NO_MATCH_DESIGNER_RECREATE'),
            isTitleDefault: true,
            isContentDefault: true,
            okText: !!attendDesignerListPossibleCount ? 'Reselect' : 'Renew',
            cancelText: 'Remove',
            onClick() {
              if (!attendDesignerListPossibleCount) {
                history.push(`${pageUrl.project.create}?projectCode=${projectCode}`);
              }
            },
            onCancel() {
              ProjectActions.delete_project_request({
                projectCode,
              });
            },
          });
        }
        if (isProjectGiveUp) {
          AppActions.add_popup({
            isOpen: true,
            type: 'confirm',
            title: 'Alert',
            // content: 'There are no matching designers.\n You can recreate or delete the project.',
            content: t('ALARM_NO_MATCH_DESIGNER_RECREATE'),
            isTitleDefault: true,
            isContentDefault: true,
            okText: 'Renew',
            cancelText: 'Remove',
            onClick() {
              history.push(`${pageUrl.project.create}?projectCode=${projectCode}`);
            },
            onCancel() {
              ProjectActions.delete_project_request({
                projectCode,
              });
            },
          });
        }
      }
    }, [
      fetchProjectSuccess,
      isProjectClient,
      isProjectReject,
      isProjectExpired,
      isProjectGiveUp,
      attendDesignerListPossibleCount,
    ]);

    return attendDesignersData ? (
      <Styled.SelectDesigner data-component-name="SelectDesigner">
        <PlainModal
          isOpen={isOpenInvitePopup.value}
          onClick={() => isOpenInvitePopup.setValue(false)}
          content={
            <ProjectInviteModalContainer onClose={() => isOpenInvitePopup.setValue(false)} />
          }
          width={1200}
          isCloseIcon={false}
          borderRadius={10}
        />

        <Grid container justify="space-between" className="selectDesigner__content_title_box">
          <Grid item xs={6}>
            <h1 className="selectDesigner__content_title">
              <T>PROJECT_PENDING_DESIGNER</T>
            </h1>
          </Grid>
          <Grid item xs={6} container alignItems="center" justify="flex-end">
            {isPossibleInvite && (
              <button
                className="selectDesigner__invite_btn btn-reset"
                onClick={() => isOpenInvitePopup.setValue(true)}
              >
                <img src={icon_paper_plane} alt="icon paper airplain" />
                <T>PROJECT_INVITE_DESIGNER</T>
              </button>
            )}

            <CustomTooltip
              // open={true}
              arrow={false}
              placement="bottom-start"
              title={t('PROJECT_DELETION_NOTIFIY')}
              disableHoverListener={false}
              interactive={false}
              customStyle={{
                color: `#303030`,
                backgroundColor: `#ffffff`,
                boxShadow: `0px 0px 6px rgb(0 0 0 / 16%)`,
                borderRadius: `10px`,
                // fontSize: `10px`,
              }}
            >
              <button className="selectDesigner__delete_btn btn-reset" onClick={onDeleteProject}>
                <T>PROJECT_DELETE_PROJECT</T>
              </button>
            </CustomTooltip>
          </Grid>
        </Grid>

        <div className="selectDesigner__interval_card_grid_wrapper">
          <IntervalGrid
            width={820}
            padding={10}
            hasPaddingGridContainer={false}
            className={cx('selectDesigner__interval_card_grid_container')}
          >
            {!!attendDesignerItems?.length &&
              attendDesignerItems.map((item, index) => {
                // console.log('selectDesignerList.value', selectDesignerList.value);
                // pushOrder 숫자표시
                const designerPushOrder = selectDesignerList.value.find(
                  selectDesigner => selectDesigner.userCode === item.designerCode,
                )?.pushOrder;
                // console.log('designerPushOrder', designerPushOrder);
                if (item.attendStatus === 1 || item.attendStatus === 3) return;
                return (
                  <Grid key={index} item xs={3} className="selectDesigner__card_grid_item">
                    <AttendingDesignerCard
                      item={item}
                      onClickDesigner={onClickDesigner}
                      isWaiting={true}
                      designerPushOrder={designerPushOrder}
                    />
                  </Grid>
                );
              })}
            {isPossibleInvite && (
              <Grid item xs={3} className="selectDesigner__card_grid_item">
                <div
                  className="selectDesigner__invite_card box-shadow-default cursor-pointer"
                  onClick={() => isOpenInvitePopup.setValue(true)}
                >
                  <div className="selectDesigner__card_row invite">
                    <div className="selectDesigner__card_cell label">
                      <figure className="selectDesigner__card_cell_airplain_icon_circle_box  box-shadow-default radius-circle">
                        <img
                          src={icon_paper_plane}
                          alt="airplain"
                          className="selectDesigner__card_cell_airplain_icon_circle"
                        />
                      </figure>{' '}
                    </div>
                    <div className="selectDesigner__card_cell text">
                      <T>PROJECT_INVITE_DESIGNER</T>
                    </div>
                  </div>
                  <div className="selectDesigner__card_row_collection">
                    <div className="selectDesigner__card_collection_icon_container">
                      <span className="selectDesigner__card_collection_icon_box">
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="21.59"
                        viewBox="0 0 17 15.943"
                      >
                        <g transform="translate(1613 19408.752)">
                          <g transform="translate(-1613 -19408.752)">
                            <g transform="translate(0 0)">
                              <g>
                                <g transform="translate(2.234 12.202)">
                                  <path
                                    d="M54.936,162.352H44.291a.95.95,0,0,1-.667-.269.9.9,0,0,1-.276-.649.931.931,0,0,1,.872-.914l3.108-.233.094-1.352a.357.357,0,0,1,.712.047l-.114,1.651a.351.351,0,0,1-.328.322l-3.417.257a.227.227,0,0,0-.212.222.217.217,0,0,0,.067.158.232.232,0,0,0,.162.066H54.936a.227.227,0,0,0,.229-.224.218.218,0,0,0-.06-.152.237.237,0,0,0-.153-.071l-3.416-.257a.352.352,0,0,1-.329-.322l-.114-1.651a.357.357,0,0,1,.712-.047l.094,1.352,3.109.233a.958.958,0,0,1,.62.291.9.9,0,0,1,.251.623A.932.932,0,0,1,54.936,162.352Z"
                                    transform="translate(-43.348 -158.61)"
                                    fill="#fff"
                                  />
                                </g>
                                <g>
                                  <g>
                                    <path
                                      d="M54.675,144.563H38.915a.622.622,0,0,1-.62-.623V132.377a.623.623,0,0,1,.62-.623h15.76a.623.623,0,0,1,.62.623v11.562A.622.622,0,0,1,54.675,144.563ZM39,143.851H54.586V132.466H39Z"
                                      transform="translate(-38.295 -131.754)"
                                      fill="#fff"
                                    />
                                  </g>
                                  <g transform="translate(1.067 10.621)">
                                    <path
                                      d="M55.218,155.73H41.064a.347.347,0,1,1,0-.694H55.218a.347.347,0,1,1,0,.694Z"
                                      transform="translate(-40.709 -155.036)"
                                      fill="#fff"
                                    />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg> */}

                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 0H1.5C0.671875 0 0 0.755859 0 1.6875V11.8125C0 12.7441 0.671875 13.5 1.5 13.5H16.5C17.3281 13.5 18 12.7441 18 11.8125V1.6875C18 0.755859 17.3281 0 16.5 0ZM1.5 1.89844C1.5 1.78242 1.58438 1.6875 1.6875 1.6875H16.3125C16.4156 1.6875 16.5 1.78242 16.5 1.89844V10.125H1.5V1.89844ZM15 17.1562C15 17.6238 14.6656 18 14.25 18H3.75C3.33437 18 3 17.6238 3 17.1562C3 16.6887 3.33437 16.3125 3.75 16.3125H6.83437L7.41563 14.3508C7.46563 14.1785 7.60937 14.0625 7.77187 14.0625H10.2312C10.3937 14.0625 10.5375 14.1785 10.5875 14.3508L11.1687 16.3125H14.25C14.6656 16.3125 15 16.6887 15 17.1562Z"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                      <span className="selectDesigner__card_collection_icon_box">
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="21.36"
                        viewBox="0 0 17 15.465"
                      >
                        <g transform="translate(1613 19381.855)">
                          <g transform="translate(-1609.783 -19377.85)">
                            <g>
                              <g>
                                <path
                                  d="M489.381,254.014a.348.348,0,0,1-.123-.023.341.341,0,0,1-.189-.185,8.891,8.891,0,0,1,0-6.82.339.339,0,0,1,.455-.177,8.169,8.169,0,0,0,6.805,0,.339.339,0,1,1,.283.615,8.849,8.849,0,0,1-7.044.144,8.222,8.222,0,0,0,0,5.656,8.756,8.756,0,0,1,3.356-.658.339.339,0,0,1,0,.678,8.082,8.082,0,0,0-3.4.739A.338.338,0,0,1,489.381,254.014Z"
                                  transform="translate(-488.388 -246.777)"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </g>
                          <g transform="translate(-1612.999 -19381.854)">
                            <g transform="translate(11.176 2.657)">
                              <path
                                d="M510.363,248.192a.339.339,0,0,1-.337-.3,6.89,6.89,0,0,0-1.329-3.4,8.787,8.787,0,0,1-1.6,1.029,10.053,10.053,0,0,1,.47,1.628.339.339,0,1,1-.671.091,8.852,8.852,0,0,0-.543-1.758.339.339,0,0,1,.173-.438,8.126,8.126,0,0,0,2-1.291.33.33,0,0,1,.25-.083.339.339,0,0,1,.234.122,7.56,7.56,0,0,1,1.692,4.033.339.339,0,0,1-.3.372Z"
                                transform="translate(-506.326 -243.661)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(0 2.656)">
                              <path
                                d="M483.238,253.59h-.027a.338.338,0,0,1-.234-.122,7.627,7.627,0,0,1,0-9.685.339.339,0,0,1,.485-.039,8.119,8.119,0,0,0,2,1.291.338.338,0,0,1,.173.439,8.216,8.216,0,0,0,0,6.3.339.339,0,0,1-.173.439,8.076,8.076,0,0,0-2,1.294A.339.339,0,0,1,483.238,253.59Zm.05-9.108a6.952,6.952,0,0,0,0,8.283,8.764,8.764,0,0,1,1.6-1.032,8.905,8.905,0,0,1,0-6.221A8.789,8.789,0,0,1,483.288,244.483Z"
                                transform="translate(-481.242 -243.659)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(1.658 0)">
                              <path
                                d="M487.5,242.183a.336.336,0,0,1-.14-.03,8.8,8.8,0,0,1-2.165-1.4.338.338,0,0,1-.038-.47,7.593,7.593,0,0,1,5.775-2.78.336.336,0,0,1,.33.245.339.339,0,0,1-.149.383,8.248,8.248,0,0,0-3.3,3.842.341.341,0,0,1-.189.185A.344.344,0,0,1,487.5,242.183Zm-1.6-1.722a8.1,8.1,0,0,0,1.433.926,8.949,8.949,0,0,1,2.374-3.078A6.916,6.916,0,0,0,485.9,240.462Z"
                                transform="translate(-485.081 -237.505)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(7.74 0)">
                              <path
                                d="M502.141,242.183a.338.338,0,0,1-.313-.208,8.243,8.243,0,0,0-3.3-3.842.339.339,0,0,1-.149-.383.349.349,0,0,1,.33-.245,7.594,7.594,0,0,1,5.776,2.78.338.338,0,0,1-.038.47,8.812,8.812,0,0,1-2.165,1.4A.337.337,0,0,1,502.141,242.183Zm-2.206-3.873a8.946,8.946,0,0,1,2.374,3.078,8.136,8.136,0,0,0,1.433-.926A6.917,6.917,0,0,0,499.936,238.31Z"
                                transform="translate(-498.366 -237.505)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(1.658 10.561)">
                              <path
                                d="M490.932,266.653h-.005a7.613,7.613,0,0,1-5.768-2.776.339.339,0,0,1,.038-.47,8.754,8.754,0,0,1,2.165-1.4.339.339,0,0,1,.452.178,8.157,8.157,0,0,0,3.257,3.82.339.339,0,0,1-.133.65ZM485.9,263.7a6.942,6.942,0,0,0,3.793,2.146,8.816,8.816,0,0,1-2.362-3.075A8.076,8.076,0,0,0,485.9,263.7Z"
                                transform="translate(-485.082 -261.975)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(7.603 14.237)">
                              <path
                                d="M498.719,271.492a.339.339,0,0,1,0-.678,6.909,6.909,0,0,0,1.955-.31.339.339,0,0,1,.2.647,7.607,7.607,0,0,1-2.146.341Z"
                                transform="translate(-498.38 -270.49)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(0 0)">
                              <path
                                d="M489.037,237.506a7.622,7.622,0,1,0,0,15.24,7.841,7.841,0,0,0,4.5-1.406l-.7-.356a7.147,7.147,0,0,1-3.8,1.084,6.944,6.944,0,1,1,7.093-7.2l.7.217A7.719,7.719,0,0,0,489.037,237.506Z"
                                transform="translate(-481.241 -237.506)"
                                fill="#fff"
                              />
                            </g>
                          </g>
                          <g transform="translate(-1613 -19374.572)">
                            <path
                              d="M491.135,255.051h-9.559a.339.339,0,1,1,0-.677h9.559a.339.339,0,1,1,0,.677Z"
                              transform="translate(-481.238 -254.374)"
                              fill="#fff"
                            />
                          </g>
                          <g transform="translate(-1605.557 -19381.855)">
                            <path
                              d="M498.451,252.743a.338.338,0,0,1-.338-.339V237.838a.339.339,0,1,1,.677,0V252.4A.339.339,0,0,1,498.451,252.743Z"
                              transform="translate(-498.113 -237.499)"
                              fill="#fff"
                            />
                          </g>
                          <g transform="translate(-1605.551 -19372.063)">
                            <path
                              d="M499.166,260.866h-.716a.339.339,0,0,1,0-.678h.716a.339.339,0,0,1,0,.678Z"
                              transform="translate(-498.111 -260.188)"
                              fill="#fff"
                            />
                          </g>
                          <g transform="translate(-1603.385 -19374.602)">
                            <g transform="translate(0)">
                              <path
                                d="M508.908,260.794h-1.8a.339.339,0,0,1,0-.678h1.8a.509.509,0,0,0,.507-.509v-4.116a.508.508,0,0,0-.507-.508h-5.014a.509.509,0,0,0-.508.508v4.116a.509.509,0,0,0,.508.509h1.647a.339.339,0,0,1,0,.678h-1.647a1.188,1.188,0,0,1-1.186-1.186v-4.116a1.188,1.188,0,0,1,1.186-1.186h5.014a1.187,1.187,0,0,1,1.185,1.186v4.116A1.187,1.187,0,0,1,508.908,260.794Z"
                                transform="translate(-502.708 -254.305)"
                                fill="#fff"
                              />
                            </g>
                            <g transform="translate(2.494 5.811)">
                              <path
                                d="M510.092,270.169a.338.338,0,0,1-.273-.138l-1.268-1.723a.339.339,0,1,1,.546-.4l.8,1.083.164-.941a.339.339,0,0,1,.668.117l-.3,1.722a.339.339,0,0,1-.256.272A.365.365,0,0,1,510.092,270.169Z"
                                transform="translate(-508.485 -267.769)"
                                fill="#fff"
                              />
                            </g>
                          </g>
                        </g>
                      </svg> */}

                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 18C4.02823 18 0 13.9718 0 9C0 4.02823 4.02823 0 9 0C13.9718 0 18 4.02823 18 9C18 13.9718 13.9718 18 9 18ZM16.0113 12.4839H13.0173C12.6907 14.0952 12.1427 15.4669 11.4496 16.4431C13.4456 15.7827 15.0859 14.3419 16.0113 12.4839ZM12.1935 9C12.1935 8.16895 12.1355 7.39597 12.0375 6.67742H5.9625C5.86452 7.39597 5.80645 8.16895 5.80645 9C5.80645 9.83105 5.86452 10.604 5.9625 11.3226H12.0375C12.1355 10.604 12.1935 9.83105 12.1935 9ZM9 16.8387C9.97621 16.8387 11.2282 15.2383 11.8343 12.4839H6.16573C6.77177 15.2383 8.02379 16.8387 9 16.8387ZM6.5504 16.4431C5.86089 15.4706 5.30927 14.0988 4.98266 12.4839H1.98871C2.91411 14.3419 4.55444 15.7827 6.5504 16.4431ZM1.16129 9C1.16129 9.80927 1.28468 10.5895 1.51331 11.3226H4.79758C4.70323 10.5786 4.64516 9.80564 4.64516 9C4.64516 8.19436 4.6996 7.42137 4.79758 6.67742H1.51331C1.28468 7.41048 1.16129 8.19073 1.16129 9ZM1.98871 5.51613H4.98266C5.30927 3.90484 5.85726 2.53306 6.5504 1.55685C4.55444 2.21734 2.91411 3.65806 1.98871 5.51613ZM9 1.16129C8.02379 1.16129 6.77177 2.76169 6.16573 5.51613H11.8343C11.2282 2.76169 9.97621 1.16129 9 1.16129ZM11.4496 1.55685C12.1391 2.52944 12.6907 3.90121 13.0173 5.51613H16.0113C15.0859 3.65806 13.4456 2.21734 11.4496 1.55685ZM13.2024 6.67742C13.2968 7.42137 13.3548 8.19436 13.3548 9C13.3548 9.80564 13.3004 10.5786 13.2024 11.3226H16.4867C16.7153 10.5895 16.8387 9.80927 16.8387 9C16.8387 8.19073 16.7153 7.41048 16.4867 6.67742H13.2024Z"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                      <span className="selectDesigner__card_collection_icon_box">
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="21.75"
                        viewBox="0 0 17 15.744"
                      >
                        <g transform="translate(1612.999 19325.745)">
                          <path
                            d="M579.407,301.341H577.3V300.2a.363.363,0,0,0-.726,0v1.142h-7.7V300.2a.363.363,0,0,0-.726,0v1.142h-2.106a1.8,1.8,0,0,0-1.816,1.779v10.69a1.8,1.8,0,0,0,1.816,1.778h10.727a.369.369,0,0,0,.257-.1l4.094-4.01a.365.365,0,0,0,.1-.23c0-.008,0-8.124,0-8.124A1.8,1.8,0,0,0,579.407,301.341Zm-13.368.711h2.106v.875a1.6,1.6,0,1,0,.726,0v-.875h7.7v.875a1.6,1.6,0,1,0,.726,0v-.875h2.106a1.08,1.08,0,0,1,1.09,1.067v3.526H564.949V303.12A1.08,1.08,0,0,1,566.039,302.052Zm2.469,2.4a.359.359,0,0,0,.363-.356v-.421a.855.855,0,0,1,.511.776.874.874,0,0,1-1.748,0,.855.855,0,0,1,.511-.776v.421A.359.359,0,0,0,568.508,304.45Zm8.431,0a.359.359,0,0,0,.363-.356v-.421a.855.855,0,0,1,.511.776.874.874,0,0,1-1.748,0,.855.855,0,0,1,.511-.776v.421A.359.359,0,0,0,576.938,304.45Zm-11.989,9.359v-6.453H580.5v3.51h-2.279a1.8,1.8,0,0,0-1.816,1.778v2.232H566.039A1.08,1.08,0,0,1,564.95,313.809Zm12.179.564v-1.729a1.08,1.08,0,0,1,1.089-1.067h1.765Z"
                            transform="translate(-2177.222 -19625.588)"
                            fill="#fff"
                          />
                        </g>
                      </svg> */}

                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.92857 2.25H3.85714V0.421875C3.85714 0.189844 4.07411 0 4.33929 0H4.66071C4.92589 0 5.14286 0.189844 5.14286 0.421875V2.25H12.8571V0.421875C12.8571 0.189844 13.0741 0 13.3393 0H13.6607C13.9259 0 14.1429 0.189844 14.1429 0.421875V2.25H16.0714C17.1362 2.25 18 3.00586 18 3.9375V16.3125C18 17.2441 17.1362 18 16.0714 18H1.92857C0.86384 18 0 17.2441 0 16.3125V3.9375C0 3.00586 0.86384 2.25 1.92857 2.25ZM16.0714 3.375H1.92857C1.575 3.375 1.28572 3.62812 1.28572 3.9375V5.625H16.7143V3.9375C16.7143 3.62812 16.425 3.375 16.0714 3.375ZM1.92857 16.875H16.0714C16.425 16.875 16.7143 16.6219 16.7143 16.3125V6.75H1.28572V16.3125C1.28572 16.6219 1.575 16.875 1.92857 16.875ZM12.0536 11.25H13.6607C13.9259 11.25 14.1429 11.0602 14.1429 10.8281V9.42188C14.1429 9.18984 13.9259 9 13.6607 9H12.0536C11.7884 9 11.5714 9.18984 11.5714 9.42188V10.8281C11.5714 11.0602 11.7884 11.25 12.0536 11.25ZM8.19643 11.25H9.80357C10.0687 11.25 10.2857 11.0602 10.2857 10.8281V9.42188C10.2857 9.18984 10.0687 9 9.80357 9H8.19643C7.93125 9 7.71429 9.18984 7.71429 9.42188V10.8281C7.71429 11.0602 7.93125 11.25 8.19643 11.25ZM4.33929 11.25H5.94643C6.21161 11.25 6.42857 11.0602 6.42857 10.8281V9.42188C6.42857 9.18984 6.21161 9 5.94643 9H4.33929C4.07411 9 3.85714 9.18984 3.85714 9.42188V10.8281C3.85714 11.0602 4.07411 11.25 4.33929 11.25ZM8.19643 14.625H9.80357C10.0687 14.625 10.2857 14.4352 10.2857 14.2031V12.7969C10.2857 12.5648 10.0687 12.375 9.80357 12.375H8.19643C7.93125 12.375 7.71429 12.5648 7.71429 12.7969V14.2031C7.71429 14.4352 7.93125 14.625 8.19643 14.625ZM12.0536 14.625H13.6607C13.9259 14.625 14.1429 14.4352 14.1429 14.2031V12.7969C14.1429 12.5648 13.9259 12.375 13.6607 12.375H12.0536C11.7884 12.375 11.5714 12.5648 11.5714 12.7969V14.2031C11.5714 14.4352 11.7884 14.625 12.0536 14.625ZM4.33929 14.625H5.94643C6.21161 14.625 6.42857 14.4352 6.42857 14.2031V12.7969C6.42857 12.5648 6.21161 12.375 5.94643 12.375H4.33929C4.07411 12.375 3.85714 12.5648 3.85714 12.7969V14.2031C3.85714 14.4352 4.07411 14.625 4.33929 14.625Z"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                      <span className="selectDesigner__card_collection_icon_box">
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 16 15.998"
                      >
                        <g transform="translate(1612.173 19353.021)">
                          <g transform="translate(-1606.701 -19349.535)">
                            <path
                              d="M476.392,387.082v.873a1.838,1.838,0,0,1,.86.348,2.663,2.663,0,0,1,.637.806l-.869.486a1.162,1.162,0,0,0-1.025-.713.938.938,0,0,0-.651.232.746.746,0,0,0-.258.579.713.713,0,0,0,.209.526,3.033,3.033,0,0,0,.829.486,8.3,8.3,0,0,1,.891.461,2.375,2.375,0,0,1,.53.417,1.865,1.865,0,0,1,.5,1.314,2.1,2.1,0,0,1-.454,1.337,2.2,2.2,0,0,1-1.2.775v.922h-.78v-.9a2.369,2.369,0,0,1-1.332-.6,2.873,2.873,0,0,1-.677-1.417l.98-.2a2.292,2.292,0,0,0,.49.967,1.15,1.15,0,0,0,.806.276,1.138,1.138,0,0,0,.82-.316,1.068,1.068,0,0,0,.325-.807.949.949,0,0,0-.272-.708,2.519,2.519,0,0,0-.408-.292,7.006,7.006,0,0,0-.688-.354,3.329,3.329,0,0,1-1.136-.713,1.784,1.784,0,0,1-.33-1.76,1.633,1.633,0,0,1,.3-.5,1.843,1.843,0,0,1,.479-.39,2.577,2.577,0,0,1,.646-.258v-.873Z"
                              transform="translate(-473.603 -387.082)"
                              fill="#fff"
                            />
                          </g>
                          <path
                            d="M8,16a8,8,0,1,1,5.659-2.342A8.009,8.009,0,0,1,8,16ZM8,.937A7.06,7.06,0,1,0,15.057,8,7.066,7.066,0,0,0,8,.937Z"
                            transform="translate(-1612.173 -19353.021)"
                            fill="#fff"
                          />
                        </g>
                      </svg> */}

                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 1C8.21997 1 6.47991 1.52784 4.99987 2.51677C3.51983 3.50571 2.36628
                        4.91131 1.68509 6.55585C1.0039 8.20038 0.82567 10.01 1.17294 11.7558C1.5202
                        13.5016 2.37737 15.1053 3.63604 16.364C4.89471 17.6226 6.49836 18.4798
                        8.24419 18.8271C9.99002 19.1743 11.7996 18.9961 13.4442 18.3149C15.0887
                        17.6337 16.4943 16.4802 17.4832 15.0001C18.4722 13.5201 19 11.78 19
                        10C18.9995 7.61321 18.0511 5.32434 16.3634 3.63663C14.6757 1.94892 12.3868
                        1.00054 10 1ZM10 18.0625C8.40538 18.0625 6.84657 17.5897 5.52069
                        16.7038C4.19482 15.8178 3.16142 14.5586 2.55119 13.0854C1.94095 11.6122
                        1.78129 9.99105 2.09238 8.42707C2.40348 6.86309 3.17136 5.42649 4.29892
                        4.29892C5.42649 3.17135 6.8631 2.40347 8.42708 2.09238C9.99106 1.78128
                        11.6122 1.94095 13.0854 2.55118C14.5586 3.16142 15.8178 4.19481 16.7038
                        5.52069C17.5897 6.84657 18.0625 8.40538 18.0625 10C18.0593 12.1373 17.2089
                        14.1862 15.6975 15.6975C14.1862 17.2089 12.1373 18.0593 10 18.0625Z"
                            fill="#fff"
                            stroke="#fff"
                            strokeWidth="0.3"
                          />
                          <path
                            d="M10.4495 9.62591V7.05448C10.9392 7.13442 11.3986 7.34417 11.7797 7.6619C11.8155 7.69514 11.8574 7.72101 11.9032 7.73803C11.949 7.75505 11.9976 7.76289 12.0464 7.7611C12.0952 7.75932 12.1432 7.74794 12.1876 7.72762C12.2319 7.7073 12.2719 7.67843 12.3051 7.64267C12.3384 7.6069 12.3642 7.56495 12.3813 7.51919C12.3983 7.47343 12.4061 7.42476 12.4043 7.37597C12.4026 7.32718 12.3912 7.27922 12.3709 7.23483C12.3505 7.19044 12.3217 7.15048 12.2859 7.11725C11.7711 6.66202 11.1298 6.37455 10.4474 6.29317V5.61286C10.4474 5.51351 10.408 5.41824 10.3377 5.34799C10.2675 5.27775 10.1722 5.23828 10.0729 5.23828C9.97351 5.23828 9.87824 5.27775 9.80799 5.34799C9.73774 5.41824 9.69828 5.51351 9.69828 5.61286V6.2871C8.42269 6.41871 7.5237 7.26303 7.5237 8.36854C7.5237 9.60566 8.94102 10.0005 9.69828 10.1908V13.0376C9.11717 12.906 8.31133 12.5679 7.99142 12.2682C7.92188 12.1987 7.82756 12.1596 7.72921 12.1596C7.63087 12.1596 7.53655 12.1987 7.46701 12.2682C7.39747 12.3377 7.3584 12.4321 7.3584 12.5304C7.3584 12.6288 7.39747 12.7231 7.46701 12.7926C7.9165 13.2421 8.96734 13.6734 9.69423 13.7868V14.4063C9.69423 14.5057 9.73369 14.601 9.80394 14.6712C9.87419 14.7414 9.96946 14.7809 10.0688 14.7809C10.1682 14.7809 10.2634 14.7414 10.3337 14.6712C10.4039 14.601 10.4434 14.5057 10.4434 14.4063V13.7989C11.3991 13.6855 12.618 13.1247 12.618 11.8491C12.6504 10.863 11.8567 10.0572 10.4495 9.62591ZM9.7003 9.42343C9.09288 9.25538 8.28298 8.97394 8.28298 8.37259C8.28298 7.58496 8.97747 7.15774 9.7003 7.04233V9.41938V9.42343ZM10.4495 13.068V10.4135C11.1237 10.6565 11.8668 11.108 11.8668 11.8754C11.8931 12.7015 10.9759 12.9627 10.4495 13.0558V13.068Z"
                            fill="#fff"
                            stroke="#fff"
                            strokeWidth="0.3"
                          />
                        </svg>
                      </span>
                    </div>
                    <ArrowForwardIosRounded
                      htmlColor="#fff"
                      className="selectDesigner__card_collection_arrow"
                    />
                  </div>
                  <div className="selectDesigner__card_row_notice">
                    {/* Promote to the designer
                    <br />
                    of your choice */}
                    <T>PROJECT_PROMOTE_DESIGNER</T>
                  </div>
                </div>
              </Grid>
            )}
          </IntervalGrid>
        </div>

        <div className="selectDesigner__option_container">
          <div className="selectDesigner__option_notice">
            <ErrorOutlineOutlinedIcon htmlColor="inherit" />
            <T>PROJECT_MAX_SELECT_DESIGNER</T>
          </div>
          <div className="selectDesigner__option_grid_box">
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              className="selectDesigner__option_btn"
              onClick={() => history.push(pageUrl.project.list)}
            >
              <T>GLOBAL_PROJECT_LIST</T>
            </MuiButton>
            <div className="selectDesigner__option_box">
              {!!pushTermList.value?.length &&
                pushTermList.value.map((item, index) => {
                  // const orderId = index + 1;
                  return (
                    <div key={item.id} className="selectDesigner__option">
                      <div className="selectDesigner__option_number">{item.id}</div>
                      <button
                        className={cx('selectDesigner__option_time btn-reset', {
                          on: item.pushTerm === 30,
                        })}
                        onClick={() =>
                          pushTermList.setValue(draft => {
                            draft[item.id - 1].pushTerm = 30;
                          })
                        }
                      >
                        30 <T>GLOBAL_MINUTES</T>
                      </button>
                      <button
                        className={cx('selectDesigner__option_time btn-reset', {
                          on: item.pushTerm === 60,
                        })}
                        onClick={() =>
                          pushTermList.setValue(draft => {
                            draft[item.id - 1].pushTerm = 60;
                          })
                        }
                      >
                        60 <T>GLOBAL_MINUTES</T>
                      </button>
                      {/* <div className="selectDesigner__option_time_box">
                  </div> */}
                    </div>
                  );
                })}
            </div>
            <MuiButton
              disableElevation
              disabled={!selectDesignerList.value?.length}
              variant="contained"
              color="primary"
              className="selectDesigner__option_btn"
              onClick={onSelect}
            >
              <T>GLOBAL_SELECT</T>
            </MuiButton>
          </div>
        </div>
      </Styled.SelectDesigner>
    ) : (
      <Styled.SelectDesigner data-component-name="SelectDesigner" />
    );
  },
);

const Styled = {
  SelectDesigner: styled.section`
    ${paper};
    padding-bottom: 30px;
    min-height: 740px;
    .selectDesigner__content_title_box {
      padding-right: 50px;
    }
    .selectDesigner__content_title {
      ${paperSubtitle};
    }
    .selectDesigner__invite_btn {
      /* position: absolute;
      top: 45px;
      right: 60px; */
      display: inline-flex;
      align-items: center;
      color: ${color.blue};
      text-decoration: underline;
      font-size: 15px;
      img {
        margin-right: 10px;
      }
    }

    .selectDesigner__delete_btn {
      margin-left: 40px;
      color: ${color.gray_font2};
      text-decoration: underline;
    }
    .selectDesigner__interval_card_grid_wrapper {
      margin: 0px 45px;
      height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .selectDesigner__interval_card_grid_container {
      padding: 6px 0;
    }

    .selectDesigner__option_container {
      margin: 35px 50px 0;
      .selectDesigner__option_notice {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: ${color.gray_week_font};
        svg {
          font-size: 18px;
          margin-right: 5px;
        }
      }
      .selectDesigner__option_grid_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        .selectDesigner__option_btn {
          min-width: 130px;
        }
        .selectDesigner__option_box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 465px;
          height: 40px;
          padding: 0 15px;
          border: 1px solid ${color.gray_border};
          border-radius: 5px;
          .selectDesigner__option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .selectDesigner__option_number {
              padding-right: 2px;
              font-size: 18px;
              color: ${color.blue};
            }
            .selectDesigner__option_time {
              width: 55px;
              height: 25px;
              border: 1px solid ${color.gray_border};
              border-radius: 2px;
              font-size: 11px;
              margin-left: 5px;
              /* > *:not(:first-child) {
              } */
              &.on {
                background-color: #919191;
                border-color: transparent;
                color: #fff;
              }
            }
            .selectDesigner__option_time_box {
            }
          }
        }
      }
    }
    .selectDesigner__invite_card {
      position: relative;
      width: 100%;
      min-height: 200px;
      padding: 15px 12px;
      border-radius: 5px;
      .selectDesigner__card_row {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-top: 9px;
        }
        .selectDesigner__card_cell {
          &.label {
            width: 30px;
            margin-right: 10px;
            text-align: center;
          }
          &.text {
            width: calc(100% - 40px);
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        &.invite {
          color: ${color.blue};
          .selectDesigner__card_cell_airplain_icon_circle_box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            .selectDesigner__card_cell_airplain_icon_circle {
              position: relative;
              left: -1px;
              width: 15px;
            }
          }
        }
      }
      .selectDesigner__card_row_collection {
        position: relative;
        margin: 15px 0 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 183px;
        height: 75px;
        background-color: ${color.blue};
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        .selectDesigner__card_collection_icon_container {
          position: relative;
          left: -6px;
          display: flex;
          flex-wrap: wrap;
          width: 80px;
          margin: auto;
          .selectDesigner__card_collection_icon_box {
            width: 50%;
            padding: 2.5px 0;
            text-align: center;
            line-height: 0;
          }
        }
        .selectDesigner__card_collection_arrow {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-size: 20px;
        }
      }
      .selectDesigner__card_row_notice {
        font-size: 12px;
        text-align: center;
        line-height: 1.5;
      }
    }
  `,
  // SelectListModalContent Popup
  SelectListModalContent: styled.div`
    .selectList__list {
      padding: 10px 20px 15px;
      .selectList__item {
        positon: relative;
        display: flex;
        padding: 10px 0;
        border: 1px solid #bbb;
        border-radius: 3px;
        align-items: center;
        &:not(:first-child) {
          margin-top: 10px;
        }
        > * {
          text-align: center;
          padding: 0 15px;
          &:not(:first-child) {
            border-left: 1px solid #bbb;
          }
        }
        .selectList__order,
        .selectList__term {
          font-size: 18px;
        }
        .selectList__order {
          color: ${color.blue};
        }
        .selectList__term {
        }
        .selectList__company {
          font-size: 16px;
        }
      }
    }
    .selectList__notice {
      font-size: 12px;
    }
  `,
};
