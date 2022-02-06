import React, { useEffect } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import MuiButton from 'components/common/button/MuiButton';
import DateConverter from 'components/common/convert/DateConverter';
import { useParams, useHistory } from 'react-router-dom';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { UserActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { icon_download } from 'components/base/images';
import { Grid } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(function UserQnaContainer() {
  const { accessToken, fetchQnaData, fetchQnaSuccess, deleteQnaSuccess } = useShallowSelector(
    state => ({
      accessToken: state.auth.accessToken,
      fetchQnaData: state.user.fetchQna.data,
      fetchQnaSuccess: state.user.fetchQna.success,
      deleteQnaSuccess: state.user.deleteQna.success,
    }),
  );

  const history = useHistory();
  const { uid, bid } = useParams();
  const fetchQna = fetchQnaData?.qna;
  const fetchQnaReply = fetchQna?.replies;

  const urlInfo = {
    uid: uid,
    bid: bid,
  };

  const fileMimeType = [
    'image/apng',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ];

  const submitParams = {
    bridgeQnaIdx: bid,
  };

  useEffect(() => {
    UserActions.fetch_qna_request(submitParams);
  }, []);

  const handleDeleteQna = () => {
    // TODO: delete action
    UserActions.delete_qna_request({ bridgeQnaIdx: bid });
  };

  useDidUpdateEffect(() => {
    // TODO: delete success -> go list
    history.push(`/@${uid}/qnas`);
  }, [deleteQnaSuccess === true]);

  const handleFileDownload = item => {
    const url = item.cloudDirectory;
    window.open(url);
  };

  const { isFetchSuccess } = useFetchLoading({ fetchQnaSuccess });
  if (!isFetchSuccess) return null;
  return (
    <UserQnaDetail
      history={history}
      fileMimeType={fileMimeType}
      urlInfo={urlInfo}
      fetchQna={fetchQna}
      fetchQnaReply={fetchQnaReply}
      handleDeleteQna={handleDeleteQna}
      handleFileDownload={handleFileDownload}
    />
  );
});

export const UserQnaDetail = React.memo(
  ({
    history,
    fileMimeType,
    urlInfo,
    fetchQna,
    fetchQnaReply,
    handleDeleteQna = () => {},
    handleFileDownload = () => {},
  }) => {
    const { uid, bid } = urlInfo;
    const { t } = useTranslation();
    return (
      <Styled.UserQnaDetail data-component-name="UserQnaDetail">
        <div className="userQna__header_box">
          <h1 className="sr-only">User Q&amp;A</h1>

          <div className="userQna__header_box_title_wrapper">
            <div className="userQna__header_box_title">
              <T>USER_MENU_QNA</T>
            </div>
          </div>
          {/* <MuiWrapper className="sm">
            <div></div>
          </MuiWrapper> */}
        </div>
        <section className="userQnaDetail__container">
          <h1 className="sr-only">QNA Detail</h1>
          <div className="userQnaDetail__question_container">
            <Grid container className="userQnaDetail__question_header container_header">
              <Grid item xs={9} className="userQnaDetail__form_grid_item title">
                <Grid item xs={1}>
                  <T>GLOBAL_TITLE</T> :
                </Grid>
                <Grid item xs={11}>
                  {fetchQna.title}
                </Grid>
              </Grid>
              <Grid item xs={3} className="userQnaDetail__form_grid_item name">
                <DateConverter timestamp={fetchQna.enrollDate} format="YYYY-MM-DD" />
              </Grid>
            </Grid>
            <div className="userQnaDetail__question_body container_body">
              {fetchQna.files?.length > 0 &&
                fetchQna.files.map((item, index) => {
                  // console.log(!!fileMimeType.find(type => type === item.fileType));
                  return (
                    !!fileMimeType.find(type => type === item.fileType) && (
                      <div className="image_box" key={item.cloudDataIdx}>
                        <img src={item.cloudDirectory} />
                      </div>
                    )
                  );
                })}
              <div className="text_box">{fetchQna.content}</div>
            </div>
            <div className="userQnaDetail__question_footer container_footer">
              <Grid container className="userQnaDetail__file">
                <Grid item className="userQnaDetail__form_grid_item label">
                  <T>GLOBAL_FILE</T> :
                </Grid>
                <Grid item className="userQnaDetail__form_grid_item title">
                  {fetchQna.files?.length > 0 &&
                    fetchQna.files.map((item, index) => {
                      // console.log(!!fileMimeType.find(type => type === item.fileType));
                      // return (
                      //   !fileMimeType.find(type => type === item.fileType) && (
                      //     <div
                      //       key={item.cloudDataIdx}
                      //       className="download_file_wrapper"
                      //       onClick={() => {
                      //         window.open(item.cloudDirectory);
                      //         // handleFileDownload(item);
                      //       }}
                      //     >
                      //       <span>{item.originName}</span>
                      //       <img src={icon_download} />
                      //     </div>
                      //   )
                      // );
                      return (
                        <div
                          key={item.cloudDataIdx}
                          className="download_file_wrapper"
                          onClick={() => {
                            window.open(item.cloudDirectory);
                            // handleFileDownload(item);
                          }}
                        >
                          <span>{item.originName}</span>
                          <img src={icon_download} />
                        </div>
                      );
                    })}
                </Grid>
              </Grid>
            </div>
          </div>
          <div className="userQnaDetail__answer_container">
            {fetchQnaReply?.length > 0 &&
              fetchQnaReply.map((item, index) => {
                return (
                  <div key={index}>
                    <Grid container className="userQnaDetail__answer_header container_header">
                      <Grid item xs={6} className="userQnaDetail__form_grid_item title">
                        <T>GLOBAL_ANSWER</T>
                      </Grid>
                      <Grid item xs={3} className="userQnaDetail__form_grid_item name">
                        {item.admin_email}
                      </Grid>
                      <Grid item xs={3} className="userQnaDetail__form_grid_item name">
                        <DateConverter timestamp={item.enroll_date} format="YYYY-MM-DD" />
                      </Grid>
                    </Grid>
                    <div className="userQnaDetail__answer_body container_body">
                      {/* <div className="image_box"></div> */}
                      {fetchQnaReply.files?.length > 0 &&
                        fetchQnaReply.files.map((item, index) => {
                          // console.log(!!fileMimeType.find(type => type === item.fileType));
                          return (
                            !!fileMimeType.find(type => type === item.fileType) && (
                              <div className="image_box" key={item.cloudDataIdx}>
                                <img src={item.cloudDirectory} />
                              </div>
                            )
                          );
                        })}
                      <div className="text_box">{item.reply}</div>
                    </div>
                    <div className="userQnaDetail__answer_footer container_footer">
                      <Grid container className="userQnaDetail__file">
                        <Grid item className="userQnaDetail__form_grid_item label">
                          <T>GLOBAL_FILE</T> :
                        </Grid>
                        <Grid item xs={10} className="userQnaDetail__form_grid_item title">
                          {fetchQnaReply.files?.length > 0 &&
                            fetchQnaReply.files.map((item, index) => {
                              console.log(
                                'file type ___ ',
                                !!fileMimeType.find(type => type === item.fileType),
                              );

                              // return (
                              //   !fileMimeType.find(type => type === item.fileType) && (
                              //     <div
                              //       key={item.cloudDataIdx}
                              //       className="download_file_wrapper"
                              //       onClick={() => {
                              //         window.open(item.cloudDirectory);
                              //         // handleFileDownload(item);
                              //       }}
                              //     >
                              //       <span>{item.originName}</span>
                              //       <img src={icon_download} />
                              //     </div>
                              //   )
                              // );
                              return (
                                <div
                                  key={item.cloudDataIdx}
                                  className="download_file_wrapper"
                                  onClick={() => {
                                    window.open(item.cloudDirectory);
                                    // handleFileDownload(item);
                                  }}
                                >
                                  <span>{item.originName}</span>
                                  <img src={icon_download} />
                                </div>
                              );
                            })}
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="button_box_wrapper">
            <Grid container spacing={1} className="button_box">
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="outlined"
                  onClick={() => {
                    history.push(`/@${uid}/qnas`);
                  }}
                >
                  <T>USER_QNA_LIST</T>
                </MuiButton>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="outlined"
                  onClick={() => {
                    handleDeleteQna();
                  }}
                >
                  <T>GLOBAL_DELETE</T>
                </MuiButton>
              </Grid>
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="contained"
                  onClick={() => {
                    history.push(`/@${uid}/qnas/edit/${bid}`);
                  }}
                >
                  <T>GLOBAL_EDIT</T>
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        </section>
      </Styled.UserQnaDetail>
    );
  },
);

const Styled = {
  UserQnaDetail: styled.div`
    .userQna__header_box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-right: 60px;
      padding-bottom: 20px;
      height: 100%;
      .userQna__header_box_title_wrapper {
        height: 34px;
        .userQna__header_box_title {
          ${beforeDash({})};
        }
      }
    }

    .userQnaDetail__container {
      width: 850px;
      margin: 0 auto;
      font-size: 14px;
      .userQnaDetail__question_container {
        .userQnaDetail__question_body {
          min-height: 160px;
        }
      }
      .userQnaDetail__answer_container {
        min-height: 155px;
        .userQnaDetail__answer_body {
          min-height: 160px;
        }
      }
      .container_header {
        border-top: 1px dotted ${color.gray_border};
        border-bottom: 1px dotted ${color.gray_border};
        padding: 20px 20px 20px 45px;
        overflow: hidden;
      }
      .container_body {
        padding: 15px 45px 25px 45px;
        .text_box {
          padding: 10px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: break-spaces;
          word-break: break-all;
        }
        .image_box {
          margin: 10px 0;
          img {
            max-height: 320px;
          }
        }
      }
      .container_footer {
        border-top: 1px dotted ${color.gray_border};
        padding: 20px 0;
        margin: 0 0 0 45px;
        /* &.userQnaDetail__question_footer {
          padding-bottom: 40px;
        } */
        .userQnaDetail__file {
          .label {
            margin-right: 10px;
            display: flex;
            align-items: flex-start;
            padding: 5px 0;
          }
          .title {
            display: block;
            width: 500px;
            .download_file_wrapper {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 5px 0;

              img {
                margin-left: 15px;
              }
              &:hover {
                cursor: pointer;
                text-decoration: underline;
              }
            }
          }
        }
      }

      .userQnaDetail__form_grid_item {
        display: flex;
        align-items: center;
        &.name {
          text-align: end;
          color: #bababa;
          justify-content: flex-end;
        }
      }
      .button_box_wrapper {
        padding-top: 35px;
        .button_box {
          display: flex;
          justify-content: space-between;
          button {
            width: 100%;
          }
        }
      }
    }
  `,
};
