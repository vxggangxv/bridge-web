import React, { useCallback } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import UserPortfolioPagingEditSlick from 'components/common/swiper/UserPortfolioPagingEditSlick';
import useInput from 'lib/hooks/useInput';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import { icon_folder_click, icon_folder_plus } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import { IconButton, TextField } from '@material-ui/core';
import { AppActions, BinActions, DesignerActions } from 'store/actionCreators';
import DropzoneWrapper from 'components/common/dropzone/DropzoneWrapper';
import CloseIcon from '@material-ui/icons/Close';
import uuid from 'react-uuid';
import { setFormData } from 'lib/library';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(function UserPortfolioEditContainer({ isEdit, isDelete, portfolioList }) {
  const isSelectedIdx = useInput('');
  const portfolioInfoTitle = useInput('');
  const portfolioInfoDetail = useInput('');
  const portfolioFileList = useMultiFileInput([]);
  const isSelectedPortfolioData = useInput('');
  const isChangeInfo = useInput(false);
  const { t } = useTranslation();

  const uploadFailPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      type: 'alert',
      // title: '* JPG, GIF, or PNG only. Max size of 10MB',
      // title:
      //   '* JPG, GIF, or PNG only. Max size of 10MB.' +
      //   '\nYou can only register up to 10 portfolio files.' +
      //   '\nAlso,  the file name can only be registered up to 127 characters including the extension.',
      title: <T>GLOBAL_ALERT</T>,
      content: t('ALARM_FILE_UPLOAD_FAIL'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        return;
      },
    });
  }, []);

  const checkFileStatus = files => {
    // * JPG, GIF, or PNG only. Max size of 10MB
    // You can only register up to 10 portfolio files.
    // Also,  the file name can only be registered up to 128 byte.
    const typeList = ['jpg', 'gif', 'png'];
    let returnFlag = true;

    if (portfolioList.length + files.length > 10) {
      return false;
    }
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].name.slice(files[i].name.lastIndexOf('.') + 1);
      const fileName = files[i].name.split('.')[0];
      if (
        !typeList.find(type => type === fileType.toLowerCase()) ||
        files[i].size > 10485760 ||
        fileName.length + fileType.length > 127
      ) {
        returnFlag = false;
        break;
      }
      //  else if (getStringByte(files[i].name.split('.')[0]) > 128) {
      //   returnFlag = false;
      //   break;
      // }
    }

    return returnFlag;
  };

  const handleAddLocalFiles = data => {
    const { dropFiles } = data;
    if (checkFileStatus(dropFiles)) {
      portfolioFileList.setValue(draft => draft.concat(dropFiles));
    } else {
      uploadFailPopup();
    }
  };

  const handleclickFileUpload = e => {
    const {
      target: { files },
    } = e;
    const fileList = Object.keys(files).reduce((acc, key) => {
      files[key].id = uuid();

      return acc.concat(files[key]);
    }, []);

    if (checkFileStatus(fileList)) {
      portfolioFileList.setValue(draft => draft.concat(fileList));
    } else {
      uploadFailPopup();
    }
  };

  const handleDeleteLocalFiles = id => {
    portfolioFileList.setValue(draft => draft.filter(item => item.id !== id));
  };

  const handleClickPortfolioSave = () => {
    const submitUpdateParams = {
      cloudFileIdx: isSelectedIdx.value,
      title: portfolioInfoTitle.value,
      detail: portfolioInfoDetail.value,
    };
    DesignerActions.edit_portfolio_request(submitUpdateParams);
  };

  const handleClickPortfolioDelete = dataIdx => {
    isDelete.setValue(true);

    const submitPortfolioData = {
      deletePortfolio: dataIdx,
      files: {
        portfolio: '',
      },
      title: '',
      detail: '',
    };
    BinActions.edit_portfolio_file_request(setFormData(submitPortfolioData));
  };

  const handleClickPortfolioUpload = () => {
    const submitPortfolioData = {
      deletePortfolio: '',
      files: {
        portfolio: portfolioFileList.value,
      },
      title: portfolioInfoTitle.value,
      detail: portfolioInfoDetail.value,
    };
    BinActions.edit_portfolio_file_request(setFormData(submitPortfolioData));
  };

  const handleClickPortfolioList = item => {
    if (!isSelectedPortfolioData.value) {
      portfolioFileList.reset();
      isSelectedIdx.setValue(item.cloudDataIdx);
      isSelectedPortfolioData.setValue(item);
      portfolioInfoTitle.setValue(!!item.title ? item.title : '');
      portfolioInfoDetail.setValue(!!item.detail ? item.detail : '');
    } else if (isSelectedIdx.value === item.cloudDataIdx) {
      isSelectedIdx.setValue('');
      isSelectedPortfolioData.setValue('');
      portfolioInfoTitle.setValue('');
      portfolioInfoDetail.setValue('');
    } else if (isChangeInfo.value) {
      AppActions.add_popup({
        isOpen: true,
        type: 'confirm',
        title: <T>GLOBAL_ALERT</T>,
        content: t('ALARM_PORTFOLIO_NO_SAVE'),
        // 'If you do not save the changes, they will not be applied. Would you like to proceed?',
        // title: '변경된 내용을 저장하지 않으면, 해당 내용은 적용되지 않습니다. 계속 진행하시겠습니까?'
        isTitleDefault: true,
        isContentDefault: true,
        onClick() {
          isChangeInfo.setValue(false);
          isSelectedIdx.setValue(item.cloudDataIdx);
          isSelectedPortfolioData.setValue(item);
          portfolioInfoTitle.setValue(!!item.title ? item.title : '');
          portfolioInfoDetail.setValue(!!item.detail ? item.detail : '');
        },
      });
    } else {
      isSelectedIdx.setValue(item.cloudDataIdx);
      isSelectedPortfolioData.setValue(item);
      portfolioInfoTitle.setValue(!!item.title ? item.title : '');
      portfolioInfoDetail.setValue(!!item.detail ? item.detail : '');
    }
  };

  return (
    <UserPortfolioEdit
      isEdit={isEdit}
      isSelectedIdx={isSelectedIdx}
      isChangeInfo={isChangeInfo}
      portfolioList={portfolioList}
      portfolioFileList={portfolioFileList}
      portfolioInfoTitle={portfolioInfoTitle}
      portfolioInfoDetail={portfolioInfoDetail}
      isSelectedPortfolioData={isSelectedPortfolioData}
      handleClickPortfolioList={handleClickPortfolioList}
      handleClickPortfolioDelete={handleClickPortfolioDelete}
      handleAddLocalFiles={handleAddLocalFiles}
      handleDeleteLocalFiles={handleDeleteLocalFiles}
      handleclickFileUpload={handleclickFileUpload}
      handleClickPortfolioSave={handleClickPortfolioSave}
      handleClickPortfolioUpload={handleClickPortfolioUpload}
    />
  );
});

export const UserPortfolioEdit = React.memo(
  ({
    isEdit,
    isSelectedIdx,
    isChangeInfo,
    portfolioList,
    portfolioFileList,
    portfolioInfoTitle,
    portfolioInfoDetail,
    isSelectedPortfolioData,
    handleClickPortfolioList = () => {},
    handleClickPortfolioDelete = () => {},
    handleAddLocalFiles = () => {},
    handleDeleteLocalFiles = () => {},
    handleclickFileUpload = () => {},
    handleClickPortfolioSave = () => {},
    handleClickPortfolioUpload = () => {},
  }) => {
    const { t } = useTranslation();
    return (
      <Styled.UserPortfolioEdit data-component-name="UserPortfolioEdit">
        <div className="userPortfolioEdit__contents_container">
          <div className="userPortfolioEdit__slider_box">
            <UserPortfolioPagingEditSlick
              height={362}
              backgroundColor="light"
              isSelectedIdx={isSelectedIdx}
              portfolioList={portfolioList}
              onClickPortfolioList={handleClickPortfolioList}
              onClickPortfolioDelete={handleClickPortfolioDelete}
            />
            <div className="userPortfolioEdit__dropzone_box_wrapper">
              <div className="userPortfolioEdit__dropzone_box">
                {isSelectedPortfolioData.value ? (
                  <div className="userPortfolioEdit__selected_portfolio ">
                    <div className="userPortfolioEdit__selected_portfolio_img_box">
                      <figure className="userPortfolioEdit__selected_portfolio_img">
                        <img
                          src={isSelectedPortfolioData.value?.cloudDirectory}
                          alt={`portfolio-${isSelectedPortfolioData.value?.cloudDataIdx}`}
                        />
                      </figure>
                    </div>
                  </div>
                ) : (
                  <>
                    <DropzoneWrapper apiRequest={handleAddLocalFiles}>
                      <div className="userPortfolioEdit__dropzone_file_list_box">
                        <div className="userPortfolioEdit__dropzone_content">
                          <ul className="userPortfolioEdit__dropzone_list">
                            {portfolioFileList.value?.length > 0 &&
                              portfolioFileList.value.map(item => (
                                <li className="userPortfolioEdit__dropzone_item" key={item.id}>
                                  <div className="userPortfolioEdit__dropzone_item_name">
                                    {item.name}
                                    {/* {item.id} */}
                                  </div>
                                  <IconButton
                                    className="userPortfolioEdit__dropzone_item_delete_btn"
                                    disableRipple
                                    onClick={e => handleDeleteLocalFiles(item.id)}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </li>
                              ))}
                          </ul>
                          {portfolioFileList.value?.length < 1 && (
                            <label
                              htmlFor="localFileInput"
                              className="userPortfolioEdit__dropzone_notice cursor-pointer"
                            >
                              <img src={icon_folder_click} />
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
                      name="localFileInput"
                      id="localFileInput"
                      onChange={e => {
                        handleclickFileUpload(e);
                        e.target.value = '';
                      }}
                      hidden
                    />
                    {!!portfolioFileList.value?.length && (
                      <button className="userPortfolioEdit__file_plus_btn btn-reset">
                        <label htmlFor="localFileInput" className="cursor-pointer">
                          <img src={icon_folder_plus} alt="folder plus" className="icon" />
                        </label>
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="userPortfolioEdit__dropzone_info_wrapper">
                <div className="userPortfolioEdit__dropzone_info">
                  <MuiWrapper
                    className="userPortfolioEdit__dropzone_info_title_wrapper"
                    config={{ height: 'initial' }}
                  >
                    <TextField
                      className="userPortfolioEdit__dropzone_info_title"
                      placeholder={t('PLACEHOLDER_FILL_BLANK_TITLE')}
                      id="portfolioInfoTitle"
                      variant="outlined"
                      fullWidth
                      multiline
                      autoComplete="off"
                      value={portfolioInfoTitle.value}
                      onChange={e => {
                        portfolioInfoTitle.onChange(e);
                        isChangeInfo.setValue(true);
                      }}
                      inputProps={{
                        maxLength: 128,
                      }}
                    />
                  </MuiWrapper>
                  <MuiWrapper
                    className="userPortfolioEdit__dropzone_info_detail_wrapper"
                    config={{ height: 'initial' }}
                  >
                    <TextField
                      className="userPortfolioEdit__dropzone_info_detail"
                      // placeholder="Please, fill this blank."
                      placeholder={t('PLACEHOLDER_FILL_BLANK_DETAIL')}
                      id="portfolioInfoDetail"
                      variant="outlined"
                      multiline
                      // rows={16}
                      fullWidth
                      value={portfolioInfoDetail.value}
                      onChange={e => {
                        portfolioInfoDetail.onChange(e);
                        isChangeInfo.setValue(true);
                      }}
                      inputProps={{
                        // maxLength: 2048,
                        maxLength: 1024,
                      }}
                    />
                  </MuiWrapper>
                </div>
                <div className="userPortfolioEdit__dropzone_info_count">
                  {portfolioInfoDetail.value.length}/1024
                </div>
                <div>
                  <ul className="userPortfolioEdit__dropzone_info_desc">
                    {!isSelectedPortfolioData.value && (
                      <li>
                        <T>DESIGNER_PORFOLIO_UPLOAD_DESCRIPTION</T>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="userPortfolioEdit__save_btn_box button_box">
          <MuiButton
            disableElevation
            variant="contained"
            color="primary"
            className="sm"
            onClick={() => {
              isEdit.setValue(false);
            }}
          >
            <T>GLOBAL_CANCEL</T>
          </MuiButton>

          {isSelectedPortfolioData.value && (
            <MuiButton
              disableElevation
              color="primary"
              className="sm"
              variant="outlined"
              onClick={() => {
                handleClickPortfolioSave();
              }}
            >
              <T>GLOBAL_SAVE</T>
            </MuiButton>
          )}

          {portfolioFileList.value?.length > 0 && (
            <MuiButton
              disableElevation
              color="primary"
              className="sm"
              variant="outlined"
              onClick={() => {
                handleClickPortfolioUpload();
              }}
            >
              Upload
            </MuiButton>
          )}
        </div>
      </Styled.UserPortfolioEdit>
    );
  },
);

const Styled = {
  UserPortfolioEdit: styled.div`
    background-color: ${color.white};
    .button_box {
      display: flex;
      justify-content: flex-end;
      /* margin-right: 65px; */
      margin-right: 63px;
      .button {
        width: 115px;
        margin-right: 15px;
      }
    }

    .userPortfolioEdit__slider_box {
      .userPortfolioEdit__dropzone_box_wrapper {
        width: 815px;
        height: 362px;
        margin: 60px auto 0;
        display: flex;
        .userPortfolioEdit__dropzone_box {
          position: relative;
          width: 605px;
          height: 362px;
          .userPortfolioEdit__selected_portfolio {
            background-color: ${color.white};
            .userPortfolioEdit__selected_portfolio_img_box {
              width: 605px;
              height: 362px;
              border: 1px solid ${color.gray_border};
              border-right: 0px;

              .userPortfolioEdit__selected_portfolio_img {
                width: 100%;
                height: 100%;
                img {
                  height: 100%;
                  width: 100%;
                }
              }
            }
          }
          .userPortfolioEdit__dropzone_file_list_box {
            /* width: 100%; */
            width: 605px;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: ${color.white};
            border: 1px solid ${color.gray_border};
            font-size: 14px;
            position: relative;

            .userPortfolioEdit__dropzone_content {
              padding: 5px 56px 5px 10px;

              .userPortfolioEdit__dropzone_list {
                margin-top: 5px;
              }
              .userPortfolioEdit__dropzone_item {
                display: flex;
                align-items: center;
                line-height: 1.3;
                padding: 5px 0;
                .userPortfolioEdit__dropzone_item_name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                }
                .userPortfolioEdit__dropzone_item_delete_btn {
                  margin-left: 5px;
                  padding: 2px;
                  svg {
                    font-size: 18px;
                  }
                }
              }
            }
          }
          .userPortfolioEdit__dropzone_notice {
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
          .userPortfolioEdit__file_plus_btn {
            position: absolute;
            /* bottom: 0px;
            right: 0px; */
            bottom: 10px;
            right: 36px;
            transform: translateX(50%);
            width: 50px;
            height: 50px;
            background-color: #fff;
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

        .userPortfolioEdit__dropzone_info_wrapper {
          width: 210px;
          padding: 20px 0;
          background-color: #bcbcbc;
          color: ${color.white};
          .userPortfolioEdit__dropzone_info {
            /* width: 210px; */
            /* padding: 20px 15px; */
            /* padding: 20px 0;
            background-color: #bcbcbc;
            color: ${color.white}; */
            width: 180px;
            margin: 0 auto;
            height: 290px;
            overflow-y: auto;
            .userPortfolioEdit__dropzone_info_title_wrapper {
              /* margin-bottom: 10px; */
              padding-bottom: 5px;
              margin-bottom: 5px;
              border-bottom: 1px solid ${color.white};
              /* padding: 0 15px; */
              .userPortfolioEdit__dropzone_info_title {
                color: ${color.white};
                white-space: break-spaces;
                word-break: break-all;
              }
            }
            .userPortfolioEdit__dropzone_info_detail_wrapper {
              margin-top: 5px;
              /* padding: 0 15px; */
              .userPortfolioEdit__dropzone_info_detail {
                color: ${color.white};
                border: none;
                white-space: break-spaces;
                word-break: break-all;
                .MuiInputBase-root {
                  textarea {
  
                    /* height: 256px !important; */
                  }

                }
              }
            }
            .MuiOutlinedInput-root {
              background-color: transparent;
              padding: 0;

              fieldset {
                border: none;
              }
              &:hover fieldset {
                border: none;
              }
              &.Mui-focused fieldset {
                border: none;
              }

              input,
              textarea {
                padding: 0;
                font-size: 15px;
                &::placeholder {
                  font-size: 15px;
                  color: ${color.white};
                  opacity: 1;
                }
              }
            }
          }
          .userPortfolioEdit__dropzone_info_count {
            font-size: 12px;
            margin: 5px 0;
            text-align: right;
            padding-right: 15px;
          }
          .userPortfolioEdit__dropzone_info_desc {
            padding-left: 15px;
            font-size: 12px;
            text-overflow: ellipsis;
            list-style-type: '* ';
          }
        }
      }
    }
    .userPortfolioEdit__save_btn_box {
      margin-top: 65px;
    }
  `,
};
