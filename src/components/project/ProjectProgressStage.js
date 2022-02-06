import { Grid } from '@material-ui/core';
import { icon_re, project_process } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import CustomSpan from 'components/common/text/CustomSpan';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { color, primaryGradient } from 'styles/utils';
import cx from 'classnames';
import { useHistory } from 'react-router';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import CheckIcon from 'components/base/icons/CheckIcon';
import CustomText from 'components/common/text/CustomText';

export default React.memo(function ProjectProgressStage({
  stage,
  timeline,
  point,
  dueDate,
  programName,
  remakeInfo,
  onOpenRemakeModal,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const { remakeCount, remakeIdx, remakeTimeline } = remakeInfo;
  // const { remakeCount, remakeIdx } = remakeInfo;
  // const remakeTimeline = [
  //   {
  //     startDate: 1637807662,
  //     endDate: 1637808025,
  //   },
  //   {
  //     startDate: 1637742970,
  //     endDate: 1637742985,
  //   },
  //   {
  //     startDate: 1637741353,
  //     endDate: 1637741630,
  //   },
  //   {
  //     startDate: 1637734354,
  //     endDate: 1637734877,
  //   },
  //   {
  //     startDate: 1637730345,
  //     endDate: 1637734024,
  //   },
  // ];
  // const timeline =  {
  //   create: 1637559149,
  //   review: null,
  //   working: null,
  //   done: null,
  //   completed: null,
  // }

  const doneTime = timeline?.done;
  const completeTime = timeline?.completed;
  const remakeTimelineAfterDesign =
    doneTime &&
    remakeTimeline.filter(item => {
      let conditions = [moment(moment.unix(item.startDate)).diff(moment.unix(doneTime)) > 0];
      if (completeTime) {
        conditions = [
          ...conditions,
          moment(moment.unix(item.startDate)).diff(moment.unix(completeTime)) < 0,
        ];
      }
      return conditions.every(item => !!item);
    });
  const remakeTimelineAfterComplete =
    completeTime &&
    remakeTimeline.filter(
      item => moment(moment.unix(item.startDate)).diff(moment.unix(completeTime)) > 0,
    );

  // console.log('moment 0', moment(moment.unix(1638762839)).diff(moment.unix(completeTime)) > 0);
  // console.log('moment 1', moment(moment.unix(1638762083)).diff(moment.unix(completeTime)) > 0);
  // console.log('moment 2', moment(moment.unix(1638762634)).diff(moment.unix(completeTime)) > 0);
  // completed: 1638762326
  // create: 1638759994
  // done: 1638761785
  // review: 1638760422
  // working: 1638760930

  const findProceedingIndex = timeline => {
    if (!timeline) {
      console.log('has no timeline');
      return 0;
    }

    const timelineHasValueList = Object.entries(timeline).reduce((acc, [key, value]) => {
      return acc.concat(!!value ? 1 : 0);
    }, []);
    const proceedingIndex = timelineHasValueList.lastIndexOf(1);

    return proceedingIndex;
  };

  // const stage = findProceedingIndex(timeline);

  // PROJECT_RECEPTION
  // PROJECT_REVIEW
  // PROJECT_REMAKE
  // PROJECT_DESIGN_START

  const timeList = [
    {
      index: 0,
      time: timeline.create,
    },
    {
      index: 1,
      time: timeline.review,
    },
    {
      index: 2,
      time: timeline.working,
    },
    {
      index: 3,
      time: timeline.completed,
    },
  ];

  const processContentList = [
    {
      stage: [0],
      title: t('PROJECT_RECEPTION'),
      subtitle: t('PROJECT_RECEPTION_SUBTITLE'),
    },
    {
      stage: [1],
      title: t('PROJECT_REVIEW'),
    },
    {
      stage: [2, 3],
      title: t('PROJECT_DESIGN_START'),
    },
    {
      stage: [4],
      title: t('PROJECT_COMPLETED'),
    },
  ];

  const currentProcessContent = useMemo(() => {
    console.log('stage', stage);
    let currentItem = processContentList.find(item => item.stage.includes(stage));
    if ([2, 3].includes(stage) && !!remakeIdx) {
      currentItem.title = t('PROJECT_REMAKE');
    }
    console.log('currentItem', currentItem);
    return currentItem;
  }, [stage]);

  // useEffect(() => {
  //   console.log('remakeTimeline', remakeTimeline);
  // }, []);

  return (
    <Styled.ProjectProgressStage data-component-name="ProjectProgressStage">
      <h1 className="sr-only">Project Progress Stage</h1>
      <Grid
        container
        alignItems="center"
        justify="flex-end"
        className="projectProgressStage__actions"
      >
        <MuiButton
          config={{
            width: 155,
            borderColor: 'white',
            color: 'white',
          }}
          variant="outlined"
          className="sm"
          onClick={() => history.push(pageUrl.project.list)}
        >
          Project list
        </MuiButton>
      </Grid>

      <Grid container className="projectProgressStage__content">
        <img
          src={project_process}
          alt="project process"
          className="projectProgressStage__project_process_img"
        />
        <Grid item xs={5}>
          <div className="projectProgressStage__step">
            {projectProcessFlagList.map((item, idx) => {
              const isCurrentStage = item.stage.includes(stage);
              const isDesignStage = item.stage.includes(2);
              const isCompleteStage = item.stage.includes(4);
              let convertedTimeline = null;
              if (isDesignStage) convertedTimeline = remakeTimelineAfterDesign;
              if (isCompleteStage) convertedTimeline = remakeTimelineAfterComplete;
              const currentDate = timeList.find(time => time.index === idx)?.time;
              const currentTime = !!currentDate
                ? moment(moment.unix(currentDate)).format('MMM. DD. YYYY HH:mm')
                : null;

              return (
                <div key={idx} className="projectProgressStage__step_item">
                  <div
                    className={cx('projectProgressStage__step_item_mark', { on: isCurrentStage })}
                  >
                    <span></span>{' '}
                  </div>
                  <CustomSpan
                    fontSize={15}
                    marginLeft={15}
                    fontColor={isCurrentStage && color.blue}
                    width={68}
                  >
                    {item.title}
                  </CustomSpan>
                  <CustomSpan fontSize={11} marginLeft={20} fontColor={color.gray_b5}>
                    {currentTime}
                  </CustomSpan>

                  {(isDesignStage || isCompleteStage) && (
                    <ul className="projectProgressStage__step_remake_list">
                      {convertedTimeline?.map(time => (
                        <li key={time.startDate} className="projectProgressStage__step_remake_item">
                          <CustomSpan
                            fontSize={11}
                            fontColor={color.blue}
                            fontWeight={500}
                            marginRight={43}
                            className="projectProgressStage__step_remake_icon_box"
                          >
                            <img
                              src={icon_re}
                              alt="remake"
                              className="projectProgressStage__step_remake_icon"
                            />{' '}
                            RE
                          </CustomSpan>
                          <CustomSpan fontSize={11} fontColor={color.gray_b5} marginRight={3}>
                            {moment(moment.unix(time.startDate)).format('MMM. DD. YYYY HH:mm')}
                          </CustomSpan>
                          {!!time.endDate && <CheckIcon color={color.blue} width={10} />}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Grid>

        <Grid item xs={7}>
          <h2 className="projectProcessStage__step_title">
            <b>[{currentProcessContent?.title}]</b>
            {currentProcessContent?.subtitle && (
              <CustomText fontSize={12} marginTop={15}>
                {currentProcessContent?.subtitle}
              </CustomText>
            )}
          </h2>
          <ul className="projectProcessStage__step_info_list">
            <li className="projectProcessStage__step_info_item">
              <CustomSpan fontSize={13} fontWeight={400} width={125}>
                - {t('GLOBAL_TOTAL_POINTS')}
              </CustomSpan>
              <CustomSpan fontColor="#9f9f9f" fontWeight={300} marginRight={5}>
                Point
              </CustomSpan>
              {point}
            </li>
            <li className="ul projectProcessStage__step_info_item">
              <CustomSpan fontSize={13} fontWeight={400} width={125}>
                - {t('PROJECT_DUE_DATE')}
              </CustomSpan>
              {moment(moment.unix(dueDate)).format('MMM. DD. YYYY HH:mm')}
            </li>
            <li className="ul projectProcessStage__step_info_item">
              <CustomSpan fontSize={13} fontWeight={400} width={125}>
                - {t('PROJECT_CAD_PROGRAM')}
              </CustomSpan>
              {programName}
            </li>
          </ul>

          {remakeIdx && (
            <div className="projectProcessStage__remake_btn_box">
              <MuiButton
                config={{
                  width: 155,
                }}
                disableElevation
                variant="contained"
                className="sm"
                onClick={() => onOpenRemakeModal({ open: true, type: 'view' })}
              >
                {t('PROJECT_REMAKE_VIEW')}
              </MuiButton>
            </div>
          )}
        </Grid>
      </Grid>
    </Styled.ProjectProgressStage>
  );
});

const Styled = {
  ProjectProgressStage: styled.section`
    margin-bottom: 30px;
    .projectProgressStage__actions {
      margin-bottom: -20px;
      height: 90px;
      padding: 0 50px;
      padding-bottom: 20px;
      background: ${({ theme }) => theme.color.primary};
      background: ${({ theme }) => theme.gradient.primary};
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
    }
    .projectProgressStage__content {
      position: relative;
      height: 370px;
      padding: 80px 50px;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
      border-radius: 10px;

      .projectProgressStage__step {
        position: relative;

        &:before {
          content: '';
          display: block;
          position: absolute;
          top: 5px;
          left: 9.5px;
          height: calc(100% - 10px);
          border-left: 1px dashed ${color.blue};
        }
        .projectProgressStage__step_item {
          position: relative;
          &:not(:first-child) {
            margin-top: 45px;
          }
          .projectProgressStage__step_item_mark {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            border-radius: 50%;

            span {
              display: block;
              width: 10px;
              height: 10px;
              background-color: ${color.blue};
              border-radius: 50%;
            }
            &.on {
              ${primaryGradient(180)};
              span {
                background-color: white;
              }
            }
          }
          .projectProgressStage__step_remake_list {
            position: absolute;
            left: 46px;
            height: 45px;
            overflow-y: auto;
            font-size: 13px;
            .projectProgressStage__step_remake_item {
              display: flex;
              align-items: center;
              margin-top: 2px;
              .projectProgressStage__step_remake_icon_box {
                display: inline-flex;
                align-items: center;
                .projectProgressStage__step_remake_icon {
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }

      .projectProcessStage__step_title {
        font-size: 20px;
        color: ${color.navy_blue};
        /* text-transform: uppercase; */
      }
      .projectProcessStage__step_info_list {
        margin-top: 35px;
        padding: 20px;
        background-color: #f5fcff;
        border-radius: 5px;
        .projectProcessStage__step_info_item {
          font-size: 15px;
          font-weight: 500;
          &:not(:first-child) {
            margin-top: 15px;
          }
        }
      }
      .projectProcessStage__remake_btn_box {
        margin-top: 40px;
      }
    }
    .projectProgressStage__project_process_img {
      position: absolute;
      top: -56px;
    }
  `,
};
