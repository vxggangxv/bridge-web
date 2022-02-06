import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import uuid from 'react-uuid';
import DropzoneWrapper from 'components/common/dropzone/DropzoneWrapper';
import { UserActions, AppActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { setFormData } from 'lib/library';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import { icon_folder_click, icon_folder_plus } from 'components/base/images';
import { Grid, TextField, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(function UserQnaContainer() {
  const {
    user,
    fetchNewQnaSuccess,
    // REVIEW: fetchData는 fetch빼고 ex. QnaData
    qnaData,
    fetchQnaSuccess,
    editQnaSuccess,
  } = useShallowSelector(state => ({
    user: state.user.user,
    fetchNewQnaSuccess: state.user.newQna.success,
    qnaData: state.user.fetchQna.data?.qna,
    fetchQnaSuccess: state.user.fetchQna.success,
    editQnaSuccess: state.user.editQna.success,
  }));

  const { uid, bid } = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  const qnaTitle = useInput('');
  const qnaDetail = useInput('');
  const localFileList = useMultiFileInput([]);
  const cloudFileList = useInput([]);
  const fileListContainer = useInput([]);
  const deleteCluodFile = useCheckSetInput(new Set([]));
  // 0: 임시저장, 1: 저장
  const qnaStatus = useInput(1);
  const matchUrl = match?.url.split('/');
  const isEdit = matchUrl?.find(element => element === 'edit');
  const { t } = useTranslation();
  const qnaContents = {
    qnaTitle,
    qnaDetail,
    localFileList,
    cloudFileList,
    fileListContainer,
  };

  const uploadFailPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      type: 'alert',
      title: <T>GLOBAL_ALERT</T>,
      content: t('USER_QNA_FILE_UPLOAD_ALERT'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        return;
      },
    });
  }, []);

  useEffect(() => {
    if (!!isEdit) {
      UserActions.fetch_qna_request({ bridgeQnaIdx: bid });
    }
  }, []);

  useDidUpdateEffect(() => {
    if (!!isEdit && fetchQnaSuccess === true) {
      qnaTitle.setValue(qnaData.title);
      qnaDetail.setValue(qnaData.content);
      cloudFileList.setValue(draft => draft.concat(qnaData.files));
      fileListContainer.setValue(draft => draft.concat(qnaData.files));
    }
  }, [fetchQnaSuccess === true, !!isEdit]);

  const handleSaveQna = () => {
    if (!!isEdit) {
      const submitEdit = {
        bridgeQnaIdx: bid,
        title: qnaTitle.value,
        content: qnaDetail.value,
        status: qnaStatus.value,
        files: {
          qnaImg: localFileList.value,
        },
        deleteQnaIdx: [...deleteCluodFile.value]?.join('%'),
      };

      UserActions.edit_qna_request(setFormData(submitEdit));
    } else {
      const submitCreate = {
        title: qnaTitle.value,
        content: qnaDetail.value,
        status: qnaStatus.value,
        files: {
          qnaImg: localFileList.value,
        },
      };

      UserActions.fetch_new_qna_request(setFormData(submitCreate));
    }
  };

  useDidUpdateEffect(() => {
    // create success
    history.push(`/@${uid}/qnas`);
  }, [fetchNewQnaSuccess === true]);

  useDidUpdateEffect(() => {
    // edit success
    history.push(`/@${uid}/qnas/detail/${bid}`);
  }, [editQnaSuccess === true]);

  const fileNameLength = files => {
    let checker = true;

    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].name.slice(files[i].name.lastIndexOf('.') + 1);
      const fileName = files[i].name.split('.')[0];
      if (fileName.length + fileType.length > 127) {
        checker = false;
        break;
      }
    }
    return checker;
  };

  const handleInputAddLocalFile = e => {
    const {
      target: { files },
    } = e;

    const fileList = Object.keys(files).reduce((acc, key) => {
      files[key].id = uuid();

      return acc.concat(files[key]);
    }, []);

    if (fileListContainer.value.length + fileList.length > 5) {
      uploadFailPopup();
    } else if (!fileNameLength(fileList)) {
      uploadFailPopup();
    } else {
      localFileList.setValue(draft => draft.concat(fileList));
      fileListContainer.setValue(draft => draft.concat(fileList));
    }
  };

  const handleAddLocalFiles = data => {
    const { dropFiles } = data;

    if (fileListContainer.value.length + dropFiles.length > 5) {
      uploadFailPopup();
    } else if (!fileNameLength(dropFiles)) {
      uploadFailPopup();
    } else {
      localFileList.setValue(draft => draft.concat(dropFiles));
      fileListContainer.setValue(draft => draft.concat(dropFiles));
    }
  };

  const handleDeleteLocalFiles = id => {
    localFileList.setValue(draft => draft.filter(item => item.id !== id));
    fileListContainer.setValue(draft => draft.filter(item => item.id !== id));
  };

  const handleDeleteCloudFiles = id => {
    deleteCluodFile.setValue(draft => new Set([...draft, id]));
    cloudFileList.setValue(draft => draft.filter(item => item.cloudDataIdx !== id));
    fileListContainer.setValue(draft => draft.filter(item => item.cloudDataIdx !== id));
  };

  const handleCancel = () => {
    if (!isEdit) {
      history.push(`/@${uid}/qnas`);
    } else {
      history.push(`/@${uid}/qnas/detail/${bid}`);
    }
  };

  const { isFetchSuccess } = useFetchLoading({ fetchQnaSuccess });
  if (!isFetchSuccess && !!isEdit) return null;
  return (
    <UserQnaCreate
      user={user}
      qnaContents={qnaContents}
      handleInputAddLocalFile={handleInputAddLocalFile}
      handleSaveQna={handleSaveQna}
      handleCancel={handleCancel}
      handleAddLocalFiles={handleAddLocalFiles}
      handleDeleteLocalFiles={handleDeleteLocalFiles}
      handleDeleteCloudFiles={handleDeleteCloudFiles}
    />
  );
});

export const UserQnaCreate = React.memo(
  ({
    user,
    qnaContents,
    handleInputAddLocalFile = () => {},
    handleSaveQna = () => {},
    handleCancel = () => {},
    handleAddLocalFiles = () => {},
    handleDeleteLocalFiles = () => {},
    handleDeleteCloudFiles = () => {},
  }) => {
    const { qnaTitle, qnaDetail, localFileList, cloudFileList, fileListContainer } = qnaContents;
    return (
      <Styled.UserQnaCreate data-component-name="UserQnaCreate">
        <div className="userQna__header_box">
          <h1 className="sr-only">User Q&amp;A</h1>

          <div className="userQna__header_box_title_wrapper">
            <div className="userQna__header_box_title">
              <T>USER_MENU_QNA</T>
            </div>
          </div>
        </div>
        <section className="userQnaCreate__container">
          <h1 className="sr-only">QNA Create</h1>

          <Grid container className="userQnaCreate__grid_claasify">
            {/* title-------------------------------------------------- */}
            <Grid item xs={12} className="userQnaCreate__form_grid_item">
              <Grid item xs={3} className="userQnaCreate__form_grid_item_label sm">
                <T>GLOBAL_TITLE</T>
              </Grid>
              <Grid container spacing={2} className="userQnaCreate__form_grid_item_content">
                <Grid item xs={8}>
                  <MuiWrapper className="sm">
                    <TextField
                      id="title"
                      name="title"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={qnaTitle.value}
                      onChange={qnaTitle.onChange}
                      inputProps={{
                        maxLength: 128,
                      }}
                    />
                  </MuiWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="userQnaCreate__grid_claasify">
            {/* writer------------------------------------------------------------- */}
            <Grid item xs={12} className="userQnaCreate__form_grid_item">
              <Grid item xs={3} className="userQnaCreate__form_grid_item_label">
                <T>GLOBAL_AUTHOR</T>
              </Grid>
              <Grid container spacing={1} className="userQnaCreate__form_grid_item_content">
                <Grid item xs={9}>
                  <span>{user.company}</span>
                </Grid>
              </Grid>
            </Grid>
            {/* detail------------------------------------------------------------------ */}
            <Grid item xs={12} className="userQnaCreate__form_grid_item">
              <Grid item xs={3} className="userQnaCreate__form_grid_item_label">
                <T>GLOBAL_MESSAGE</T>
              </Grid>
              <Grid container spacing={1} className="userQnaCreate__form_grid_item_content">
                <Grid item xs={8} className="userQnaCreate__form_grid_item_multi_text_wrapper">
                  <MuiWrapper className="userQnaCreate__form_grid_item_multi_text">
                    <TextField
                      id="Detail"
                      name="Detail"
                      variant="outlined"
                      multiline
                      rows={17}
                      fullWidth
                      value={qnaDetail.value}
                      onChange={e => {
                        qnaDetail.onChange(e);
                      }}
                      inputProps={{
                        maxLength: 2048,
                      }}
                    />
                  </MuiWrapper>
                  <div className="text_count">{qnaDetail.value.length}/2048</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="userQnaCreate__grid_claasify">
            {/* file upload----------------------------------------------------------------------- */}
            <Grid item xs={12} className="userQnaCreate__form_grid_item">
              <Grid item xs={3} className="userQnaCreate__form_grid_item_label">
                <T>GLOBAL_ADD_FILES</T>
              </Grid>
              <Grid container className="userQnaCreate__form_grid_item_content">
                <Grid item xs={8} className="userQnaCreate__uploaded_file_wrapper">
                  <DropzoneWrapper apiRequest={handleAddLocalFiles}>
                    <div className="userQnaCreate__dropzone_file_list_box">
                      <div className="userQnaCreate__dropzone_content">
                        <ul className="userQnaCreate__dropzone_list">
                          {cloudFileList.value?.length > 0 &&
                            cloudFileList.value.map(item => (
                              <li className="userQnaCreate__dropzone_item" key={item.cloudDataIdx}>
                                <div className="userQnaCreate__dropzone_item_name">
                                  {item.originName}
                                </div>
                                <IconButton
                                  className="userQnaCreate__dropzone_item_delete_btn"
                                  disableRipple
                                  onClick={e => handleDeleteCloudFiles(item.cloudDataIdx)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </li>
                            ))}
                          {localFileList.value?.length > 0 &&
                            localFileList.value.map(item => (
                              <li className="userQnaCreate__dropzone_item" key={item.id}>
                                <div className="userQnaCreate__dropzone_item_name">
                                  {item.name}
                                  {/* {item.id} */}
                                </div>
                                <IconButton
                                  className="userQnaCreate__dropzone_item_delete_btn"
                                  disableRipple
                                  onClick={e => handleDeleteLocalFiles(item.id)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </li>
                            ))}
                        </ul>
                        {fileListContainer.value?.length < 1 && (
                          <label
                            htmlFor="addFileInput"
                            className="userQnaCreate__dropzone_notice cursor-pointer"
                          >
                            <img src={icon_folder_plus} />
                            <span className="cursor-default">
                              + <T>GLOBAL_ADD_FILES</T>
                            </span>
                            <span className="cursor-default">
                              <T>GLOBAL_DRAG_DROP</T>
                            </span>
                            <span className="cursor-pointer">
                              <T>GLOBAL_CLICK</T>
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </DropzoneWrapper>
                  <input
                    type="file"
                    multiple
                    name="addFileInput"
                    id="addFileInput"
                    onChange={e => {
                      handleInputAddLocalFile(e);
                      e.target.value = '';
                    }}
                    hidden
                  />
                  {!!fileListContainer.value?.length && (
                    <button className="userQnaCreate__file_plus_btn btn-reset">
                      <label htmlFor="addFileInput" className="cursor-pointer">
                        <img src={icon_folder_plus} alt="folder plus" className="icon" />
                      </label>
                    </button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className="button_box_wrapper">
            <Grid container spacing={1} className="button_box">
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="outlined"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  <T>GLOBAL_CANCEL</T>
                </MuiButton>
              </Grid>
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="contained"
                  onClick={() => {
                    handleSaveQna();
                  }}
                >
                  <T>GLOBAL_SUBMIT</T>
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        </section>
      </Styled.UserQnaCreate>
    );
  },
);

const Styled = {
  UserQnaCreate: styled.div`
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

    .userQnaCreate__container {
      width: 850px;
      margin: 0 auto;
      font-size: 15px;
      .userQnaCreate__grid_claasify {
        border-top: 1px dotted ${color.gray_border};
        &:nth-child(2) {
          padding-top: 15px;
          padding-bottom: 25px;
        }
        &:nth-child(3) {
          padding-top: 15px;
        }
      }
      .userQnaCreate__form_grid_item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .userQnaCreate__form_grid_item_label {
          padding-left: 40px;
          text-align: left;
          font-size: 15px;
        }

        .userQnaCreate__form_grid_item_option {
          display: flex;
          align-items: center;
          .userQnaCreate__form_grid_item_option_name {
            display: flex;
            align-items: center;
            img {
              padding: 0 5px 0 10px;
            }
          }
        }

        .userQnaCreate__form_grid_item_content {
          font-size: 14px;

          .userQnaCreate__form_grid_item_multi_text_wrapper {
            height: 100%;
            .userQnaCreate__form_grid_item_multi_text {
              height: 100%;
            }
          }
          .userQnaCreate__file_upload_btn_wrapper {
            width: 100%;
            div {
              width: 100%;
              .file_upload_button {
                width: 100%;
                padding: 0;
                span {
                  height: 100%;
                  label {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                      height: initial;
                    }
                    &:hover {
                      cursor: pointer;
                    }
                  }
                }
              }
            }
          }
          .userQnaCreate__uploaded_file_wrapper {
            position: relative;
            height: 150px;
            .userQnaCreate__dropzone_file_list_box {
              width: 100%;
              height: 100%;
              padding: 0px 30px 0px 10px;
              overflow-y: auto;
              background-color: ${color.white};
              border: 1px solid ${color.gray_border};
              border-radius: 5px;
              font-size: 14px;
              position: relative;

              .userQnaCreate__dropzone_content {
                .userQnaCreate__dropzone_list {
                  margin-top: 5px;
                }
                .userQnaCreate__dropzone_item {
                  position: relative;
                  line-height: 1.3;
                  display: flex;
                  align-items: center;
                  padding-bottom: 5px;
                  .userQnaCreate__dropzone_item_delete_btn {
                    margin-left: 5px;
                    padding: 2px;
                    svg {
                      font-size: 18px;
                    }
                  }
                }
              }
            }
            .userQnaCreate__dropzone_notice {
              z-index: 0;
              opacity: 0.6;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              span {
                margin-left: 15px;
                color: ${color.gray_font2};
                &:nth-child(2) {
                  color: #000000;
                }
                &:nth-child(4) {
                  text-decoration: underline;
                }
              }
            }

            .userQnaCreate__file_plus_btn {
              position: absolute;
              /* bottom: 0px;
                right: 0px; */
              bottom: 5px;
              right: 5px;
              transform: translateX(50%);
              width: 50px;
              height: 50px;
              background-color: ${color.white};
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
              border-radius: 50%;
              label {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
              }
            }
          }

          .text_count {
            margin-top: 5px;
            text-align: right;
            color: ${color.gray_font2};
            font-size: 12px;
          }
        }
      }
    }
    .button_box_wrapper {
      padding-top: 35px;
      .button_box {
        display: flex;
        justify-content: flex-end;
        button {
          width: 100%;
        }
      }
    }
  `,
};
