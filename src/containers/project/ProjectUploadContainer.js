import { Grid, IconButton } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import cx from 'classnames';
import DownloadIcon from 'components/base/icons/DownloadIcon';
import EyeIcon from 'components/base/icons/EyeIcon';
import TrashIcon from 'components/base/icons/TrashIcon';
import { icon_folder_plus } from 'components/base/images';
import CircularLoading from 'components/base/loading/CircularLoading';
import MuiButton from 'components/common/button/MuiButton';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import DropzoneWrapper from 'components/common/dropzone/DropzoneWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import ProjectModelViewer from 'components/project/ProjectModelViewer';
import { ProjectContext } from 'contexts/project/ProjectContext';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useInput from 'lib/hooks/useInput';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import { cutUrl, shuffleArray } from 'lib/library';
import { fileExtensionList, projectEventType } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AppActions, BinActions, ProjectActions } from 'store/actionCreators';
import { downloadFile } from 'store/utils';
import styled from 'styled-components';
import { color } from 'styles/utils';

const imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
const modelTypes = ['obj', 'ply', 'stl'];

/**
 * @params {boolean} hasViewer : show viewer
 * @params {boolean} hasUpload : show upload button
 * @params {'string'} viewType : if 'modal', change UI
 * @params {boolean} isEdit : if true, change UI
 */
// detailPage에서 hasViewser true 로 호출
export default React.memo(function ProjectUploadContainer({
  hasViewer = false,
  hasUpload = false,
  viewType,
  isEdit,
  // tablebodyHeight = 287,
}) {
  const { user, accessToken, deleteProjectFileSuccess, uploadProjectFileSuccess } =
    useShallowSelector(state => ({
      user: state.user.user,
      accessToken: state.auth.accessToken,
      deleteProjectFileSuccess: state.bin.deleteProjectFile.success,
      uploadProjectFileSuccess: state.bin.uploadProjectFile.success,
    }));
  const { pcode } = useParams();
  const projectCode = pcode;
  const company = user?.company;
  // const isSender = userType === 'sender';
  // const { pathname } = useLocation();
  // const isDetailPage = cutUrl(pathname, 1) === 'detail';
  // viewModelFile = {
  //   isView: Boolean
  //   isValidObj: Boolean
  //   name: String
  //   url: String
  //   textureUrl: String
  //   mtlUrl: String
  // }
  const viewModelFile = useInput([]);
  const viewHtmlFile = useInput(null);
  const viewImageFile = useInput(null);
  const localFileInput = useMultiFileInput([]);
  const localFileInputRef = useRef();
  const checkAllCloud = useCheckOneInput(false);
  const checkAllLocal = useCheckOneInput(false);
  const { cloudFileListCt, localFileListCt } = useContext(ProjectContext);
  const cloudFileList = useInput([]);
  // cloudFileList parsing, onChange context - cloudFileListCt

  // TODO: hasNewFile 키값기준 0이 있을 경우 Done 활성화
  // fileUpload: "FILE_UPLOAD",
  // fileDownload: "FILE_DOWNLOAD",
  // fileDelete: "FILE_DELETE",
  //   {
  //     "projectCode": "403dc627da99a957b91ac2ad086b326f",
  //     "eventType": "FILE_UPLOAD",
  //     "params":{
  //         "files":"test_file1.txt, test_file2.txt,"
  //     }
  // }

  const viewColors = useMemo(() => {
    const array = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      // '#2196f3',
      // '#03a9f4',
      // '#00bcd4',
      // '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#aa2e25',
      '#a31545',
      '#6d1b7b',
      '#2c387e',
      '#482880',
      '#b28704',
      '#b26a00',
      '#b23c17',
    ];
    return shuffleArray(array);
  }, []);

  const cloudFileListValue = useMemo(() => {
    let modelNumber = 0;
    return cloudFileListCt.value?.reduce((acc, curr, index) => {
      // uploadState: {0, 1}: loading, {2}: success, {3}: error
      // cloudDirectory: downlaod클릭시 링크
      const { originName } = curr;
      const type = originName.slice(originName.lastIndexOf('.') + 1);
      // 사용X
      const groupName =
        originName.substring(0, originName.lastIndexOf('-')) +
        originName.slice(originName.lastIndexOf('.'));
      if (modelTypes.includes(type)) modelNumber = modelNumber + 1;
      const obj = {
        ...curr,
        type,
        groupName,
        isDownload: false,
        isView: false,
        viewColor:
          modelTypes.includes(type) && modelNumber <= 20 ? viewColors[modelNumber - 1] : null,
        isChecked: false,
      };
      return acc.concat(obj);
    }, []);
  }, [cloudFileListCt.value]);

  // localFileList parsing
  const updateLocalFileList = useCallback(items => {
    // console.log('items', items);
    const returnValue = items?.reduce((acc, curr, index) => {
      // console.log('curr', curr);
      const { id, file, name } = curr;
      const type = name.slice(name.lastIndexOf('.') + 1);
      // const id = index;
      const obj = {
        index,
        id,
        file: !!file ? file : curr,
        name,
        type,
        isView: false,
        isChecked: false,
      };
      return acc.concat(obj);
    }, []);

    // console.log('returnValue', returnValue);
    return returnValue;
  }, []);
  // toggleView 이전 파일 프리릭스 비교용
  const [filePrefixList, setFilePrefixList] = useState('');
  const [fileUrlList, setFileUrlList] = useState([]);

  // onChange cloueFileList: ProjectContainer 에서 cloudFileList변경에 따라 적용
  // init list after data fetch
  useEffect(() => {
    console.log('------------------------------- cloudFileList.value change');
    // console.log('cloudFileList.value', cloudFileList.value);
    console.log('cloudFileListValue', cloudFileListValue);
    cloudFileList.setValue(cloudFileListValue);
    viewModelFile.setValue([]);
    viewImageFile.setValue(null);
    viewHtmlFile.setValue(null);
  }, [cloudFileListCt.value]);

  // onChange localFileInput: localFileInput의 변경에 따라 Context변수 변경(상위 onUpload이벤트에서 사용)
  useDidUpdateEffect(() => {
    // console.log(localFileInput.value, 'localFileInput.value');
    // localFileListCt.setValue(localFileListValue);
    localFileListCt.setValue(draft => draft.concat(updateLocalFileList(localFileInput.value)));
  }, [localFileInput.value]);

  // onChange checkAll
  useDidUpdateEffect(() => {
    console.log('checkAllCloud.value', checkAllCloud.value);
    // console.log('cloudFileListCt', cloudFileListCt);
    cloudFileList.setValue(draft => {
      return draft.reduce((acc, curr) => {
        if (checkAllCloud.value === true) {
          curr.isChecked = true;
        } else {
          curr.isChecked = false;
        }

        return acc.concat(curr);
      }, []);
    });
  }, [checkAllCloud.value]);

  // useEffect(() => {
  //   console.log('fileUrlList', fileUrlList);
  // }, [fileUrlList]);
  // useEffect(() => {
  //   console.log('viewModelFile.value', viewModelFile.value);
  // }, [viewModelFile.value]);

  const handleClickCloudFile = useCallback(
    (e, id, data = { action: '', value: null }) => {
      const { action, value } = data;
      // console.log(data, 'data');

      if (action === 'checkCloudFile') {
        cloudFileList.setValue(draft => {
          return draft.reduce((acc, curr) => {
            if (curr.cloudDataIdx === id) {
              curr.isChecked = !curr.isChecked;
            } else {
              curr.isChecked = false;
            }
            return acc.concat(curr);
          }, []);
        });
      }

      if (action === 'toggleViewCloudHtmlFile') {
        const { isView, url } = value;

        // html 파일 view 클릭시 나머지 view 다 꺼짐
        cloudFileList.setValue(draft => {
          return draft.reduce((acc, curr) => {
            if (curr.cloudDataIdx === id) {
              curr.isView = !isView;
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewImageFile.setValue(null);
        const currentUrl = !isView ? `${url}&token=${accessToken}` : null;
        viewHtmlFile.setValue(currentUrl);

        return;
      }

      if (action === 'toggleViewCloudImageFile') {
        const { isView, url } = value;

        // view 클릭시 나머지 view 다 꺼짐
        cloudFileList.setValue(draft => {
          return draft.reduce((acc, curr) => {
            if (curr.cloudDataIdx === id) {
              curr.isView = !isView;
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewHtmlFile.setValue(null);
        const currentUrl = !isView ? `${url}&token=${accessToken}` : null;
        viewImageFile.setValue(currentUrl);

        return;
      }

      if (action === 'toggleViewCloudModelFile') {
        // file name format YYYY-MM-DD_case ID-다른이름.stl
        const { name, type, groupName, isView, viewColor, url, resourceFileList = [] } = value;

        // image, html 끄기
        cloudFileList.setValue(draft => {
          return draft.reduce((acc, curr) => {
            if ([...imgTypes, 'html'].includes(curr.type)) {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // 연결 resourceFile 찾기
        const resourceFileListValue = cloudFileList.value.filter(item =>
          resourceFileList.includes(item.cloudDataIdx),
        );
        // mtl file
        const mtlUrl = resourceFileListValue.find(item => item.type === 'mtl')?.viewDirectory;
        // texture file, 없을 경우에는 check no
        let textureUrl = '';
        if (!!resourceFileListValue.length) {
          textureUrl = resourceFileListValue.find(item => {
            // console.log([...imgTypes].includes(item.type));
            return [...imgTypes].includes(item.type);
          })?.viewDirectory;
        }
        // console.log('textureUrl', textureUrl);

        // url여부로 3d canvas show 결정, url값을 주지 않을 경우 modelViewer valid 체크에서 걸림
        let isValidObj = true;
        if (type === 'obj') {
          isValidObj = !!textureUrl && !!mtlUrl;
        }

        const currentUrl = `${url}&token=${accessToken}`;
        const modelData = {
          isView: !isView,
          viewColor,
          isValidObj,
          name,
          url: currentUrl,
          textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
          mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
        };
        // console.log('modelData', modelData);

        // console.log('viewModelFile.value.prefixName', viewModelFile.value.prefixName);
        // console.log('groupName', groupName);
        // const isSameGroup = viewModelFile.value.prefixName === groupName;

        // validation check
        if (!isValidObj) {
          return AppActions.show_toast({
            type: 'error',
            message: 'This is not valid file.\n Please check your file source.',
          });
        }

        viewModelFile.setValue(draft => {
          // 최초 생성
          if (!draft.length) {
            return draft.concat(modelData);
          } else {
            // re click 경우
            if (draft.some(item => item.url === currentUrl)) {
              return draft.filter(item => item.url !== currentUrl);
            } else {
              return draft.concat(modelData);
            }
          }
        });

        // if (isSameGroup) {
        //   // 현재 파일과 prefix가 같을 경우 urlList에 추가
        //   console.log('is same?');
        //   viewModelFile.setValue(draft => {
        //     const hasUrl = draft.url.includes(currentUrl);
        //     console.log('hasUrl', hasUrl);
        //     // console.log('draft.url', draft.url);
        //     const currentFileList = hasUrl
        //       ? draft.url.filter(item => item !== currentUrl)
        //       : draft.url.concat(currentUrl);
        //     // const toggleViewFileList = isView
        //     return {
        //       ...modelData,
        //       isView: !!currentFileList.length,
        //       prefixName: groupName,
        //       url: isValidObj ? currentFileList : [],
        //     };
        //   });
        // } else {
        //   // 최초 또는 현재 파일과 다를 경우 새롭게 생성
        //   console.log('is not same?');
        //   viewModelFile.setValue(draft => {
        //     console.log('draft.url.length', !!draft.url.length);
        //     return {
        //       ...modelData,
        //       isView: !isView,
        //       prefixName: groupName,
        //       url: isValidObj ? [currentUrl] : [],
        //     };
        //   });
        // }

        // ui view toggle
        cloudFileList.setValue(draft => {
          return draft.reduce((acc, curr) => {
            if (curr.cloudDataIdx === id) {
              curr.isView = !isView;
            } else {
              // curr.isView = false;
            }
            // else if (curr.groupName === groupName) {
            //   // curr.isView = false;
            // }

            return acc.concat(curr);
          }, []);
        });

        // 컴포넌트 끄기
        viewHtmlFile.setValue(null);
        viewImageFile.setValue(null);

        return;
      }

      // TODO: link 변경 예정
      if (action === 'downloadCloudFile') {
        const { name, isDownload, url, disabled } = value;
        // console.log('value', value);
        // console.log('`${url}&token=${accessToken}`', `${url}&token=${accessToken}`);
        if (disabled) {
          AppActions.add_popup({
            isOpen: true,
            title: <T>GLOBAL_ALERT</T>,
            content: <T>PROJECT_DOWNLOAD_ALARM</T>,
            isTitleDefault: true,
            isContentDefault: true,
          });

          return;
        }

        downloadFile({
          url: `${url}&token=${accessToken}`,
          name,
          // config: {
          //   headers: {
          //     'x-access-token': accessToken,
          //   },
          // },
          success() {
            cloudFileList.setValue(draft => {
              return draft.reduce((acc, curr) => {
                if (curr.cloudDataIdx === id) {
                  curr.isDownload = true;
                }

                return acc.concat(curr);
              }, []);
            });

            const createHistoryData = {
              projectCode,
              eventType: projectEventType.fileDownload,
              params: {
                content: `${company}, ${name}`,
              },
            };
            ProjectActions.create_project_history_request(createHistoryData);
          },
        });
        return;
      }

      if (action === 'deleteCloudFile') {
        const { name } = value;
        const deleteData = {
          projectCode,
          cloudFileList: [id],
        };
        console.log('deleteData-', deleteData);
        // request api - delete
        BinActions.delete_project_file_request(deleteData);

        const createHistoryData = {
          projectCode,
          eventType: projectEventType.fileDelete,
          params: {
            content: `${company}, ${name}`,
          },
        };
        ProjectActions.create_project_history_request(createHistoryData);
        return;
      }
    },
    [cloudFileList.value],
  );

  // projectFile delete 한후 fetch
  // response deleteProjectFileSuccess
  useDidUpdateEffect(() => {
    if (deleteProjectFileSuccess) {
      ProjectActions.fetch_project_files_request({ projectCode });
    }
  }, [deleteProjectFileSuccess]);

  const handleClickLocalFile = useCallback(
    (e, id, data = { action: '', value: null }) => {
      const { action, value } = data;
      console.log('id', id);
      console.log('data', data);

      // if (action === 'checkLocalFile') {
      //   localFileListCt.setValue(draft => {
      //     return draft.reduce((acc, curr) => {
      //       if (curr.cloudDataIdx === id) curr.isChecked = !curr.isChecked;

      //       return acc.concat(curr);
      //     }, []);
      //   });
      // }

      if (action === 'deleteLocalFile') {
        localFileListCt.setValue(draft => draft.filter(item => item.id !== id));
        // console.log('ref.current', ref.current.files[0]);
        // console.log('ref.current', ref.current.files[1]);
        localFileInputRef.current.value = null;
        return;
      }
    },
    [localFileListCt.value],
  );

  const handleAddLocalFiles = data => {
    // console.log('data', data);
    const { dropFiles } = data;
    // console.log('dropFiles', dropFiles);
    // localFileInput.setValue(draft => draft.concat(dropFiles));
    localFileInput.setValue(dropFiles);
  };

  useDidUpdateEffect(() => {
    if (uploadProjectFileSuccess) {
      localFileInput.setValue([]);
      localFileInputRef.current.value = null;
    }
  }, [!!uploadProjectFileSuccess]);

  return (
    <ProjectUpload
      hasViewer={hasViewer}
      hasUpload={hasUpload}
      viewType={viewType}
      isEdit={isEdit}
      checkAllLocal={checkAllLocal}
      checkAllCloud={checkAllCloud}
      localFileInput={localFileInput}
      localFileInputRef={localFileInputRef}
      localFileListCt={localFileListCt}
      cloudFileList={cloudFileList}
      viewModelFile={viewModelFile}
      viewHtmlFile={viewHtmlFile}
      viewImageFile={viewImageFile}
      onClickCloudFile={handleClickCloudFile}
      onClickLocalFile={handleClickLocalFile}
      onAddLocalFiles={handleAddLocalFiles}
    />
  );
});

export const ProjectUpload = React.memo(function ProjectUpload({
  hasViewer,
  hasUpload,
  viewType,
  isEdit,
  checkAllLocal,
  checkAllCloud,
  localFileInput,
  localFileInputRef,
  localFileListCt,
  cloudFileList,
  viewModelFile,
  viewHtmlFile,
  viewImageFile,
  onClickCloudFile,
  onClickLocalFile,
  onAddLocalFiles,
}) {
  const { projectInfo, userCode, accessToken } = useShallowSelector(state => ({
    projectInfo: state.project.project.data?.projectInfo,
    userCode: state.user.user?.userCode,
    accessToken: state.auth.accessToken,
  }));
  const { pathname } = useLocation();
  const isDetailPage = cutUrl(pathname, 1) === 'detail';
  const isCreatePage = cutUrl(pathname, 1) === 'create';
  const stage = projectInfo?.stage;
  const isSender = userCode === projectInfo?.senderCode;
  const isReceiver = userCode === projectInfo?.receiverCode;
  const isAdmin = userCode === projectInfo?.adminCode;
  const { onCheckExistingUploadUserFile, onUploadLocalFile } = useContext(ProjectContext);

  // const localFileInputRef = useRef();
  const isScrollCloudFileList = cloudFileList.value?.length >= 4;
  const isScrollLocalFileList = localFileListCt.value?.length >= 4;
  const isScrollFileList = isScrollCloudFileList || isScrollLocalFileList;

  // function
  const handleUploadLocalFile = () => onCheckExistingUploadUserFile(onUploadLocalFile);

  return (
    <Styled.ProjectUpload
      data-component-name="ProjectUpload"
      isDetailPage={isDetailPage}
      viewType={viewType}
      isEdit={isEdit}
    >
      {/* <div className="projectUpload__file_open_box">
        <div className="projectUpload__file_open_btn_box">
          <input
            type="file"
            multiple
            name="localFileInput"
            id="localFileInput"
            onChange={localFileInput.onChange}
            hidden
          />
          <MuiButton
            data-type="label"
            disableElevation
            variant="outlined"
            color="primary"
            className="sm projectUpload__file_open_btn"
          >
            <label htmlFor="localFileInput" className="cursor-pointer">
              Folder Open
            </label>
          </MuiButton>
        </div>
      </div> */}

      {/* <Grid item container>
          <Grid item xs={6}>
            아
          </Grid>
          <Grid item xs={6}>
            아
          </Grid>
        </Grid> */}
      <Grid container className={cx('projectUpload__grid_container', { detail: isDetailPage })}>
        {useMemo(() => {
          return (
            <>
              {hasViewer && (
                <Grid item container className="projectUpload__grid_item viewer">
                  <div className="projectUpload__viewer_box">
                    {!!viewModelFile.value?.length && (
                      <ProjectModelViewer
                        model={viewModelFile.value}
                        width={838}
                        className="projectUpload__modelViewer"
                      />
                    )}
                    {viewHtmlFile.value && (
                      <div className="projectUpload__htmlViewer">
                        {/* <div dangerouslySetInnerHTML={{ __html: viewHtmlFile.value }} /> */}
                        <iframe
                          src={viewHtmlFile.value}
                          frameBorder="0"
                          title="3D model web viewer"
                        ></iframe>
                      </div>
                    )}
                    {viewImageFile.value && (
                      <div className="projectUpload__imageViewer">
                        {/* <div dangerouslySetInnerHTML={{ __html: viewHtmlFile.value }} /> */}
                        <img src={viewImageFile.value} />
                        {/* <iframe
                          src={viewHtmlFile.value}
                          frameBorder="0"
                          title="3D model web viewer"
                        ></iframe> */}
                      </div>
                    )}
                  </div>
                </Grid>
              )}
            </>
          );
        }, [hasViewer, viewModelFile.value, viewHtmlFile.value])}

        <Grid
          item
          container
          className={cx('projectUpload__grid_item table', { create: isCreatePage })}
        >
          <div className="projectUpload__table_wrapper">
            <div className="projectUpload__table_container">
              <div
                aria-label="project file table"
                className={cx('projectUpload__table', { create: isCreatePage })}
              >
                <div className="projectUpload__table_head">
                  {isDetailPage && (
                    <Grid
                      item
                      container
                      alignItems="center"
                      justify="center"
                      className="projectUpload__table_group"
                    >
                      <div>{/* <T>GLOBAL_LOCATION</T> */}</div>
                    </Grid>
                  )}
                  <Grid item container alignItems="center" className="projectUpload_file_list_cell">
                    <div className="projectUpload_file_list head">
                      <Grid container className="projectUpload_file_item_grid_container">
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectUpload__file_list_item_cell check_all"
                        >
                          <div>
                            <label className="cursor-pointer">
                              <CustomCheckbox
                                width={15}
                                borderColor="white"
                                checked={checkAllCloud.value}
                                onChange={checkAllCloud.onChange}
                              />
                            </label>
                          </div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          className="projectUpload__file_list_item_cell filename"
                        >
                          <div>
                            <T>GLOBAL_FILE_NAME</T>
                          </div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="flex-end"
                          className="projectUpload__file_list_item_cell actions"
                        >
                          <div>
                            {isDetailPage && (
                              <>
                                <CustomSpan style={{ width: '38px', textAlign: 'center' }}>
                                  <DownloadIcon width={16} color={color.gray_b5} />
                                </CustomSpan>
                                {hasViewer && (
                                  <CustomSpan style={{ width: '38px', textAlign: 'center' }}>
                                    <EyeIcon width={18} color={color.gray_b5} />
                                  </CustomSpan>
                                )}
                              </>
                            )}

                            <CustomSpan style={{ width: '38px', textAlign: 'center' }}>
                              <TrashIcon width={14} />
                            </CustomSpan>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                </div>

                <div className="projectUpload__table_body">
                  {/* Cloud */}
                  {isDetailPage && (
                    <div className="projectUpload__table_body_cloud">
                      <Grid
                        item
                        container
                        alignItems="center"
                        justify="center"
                        className="projectUpload__table_group"
                      >
                        <div className="projectUpload__table_check_all_box">
                          <span className="label">
                            <T>GLOBAL_CLOUD</T>
                          </span>

                          <div className="projectUpload__table_from_mark_list">
                            <div className="projectUpload__table_from_mark_item">
                              <span className="projectUpload__table_from_mark client"></span>
                              Client
                            </div>
                            <div className="projectUpload__table_from_mark_item">
                              <span className="projectUpload__table_from_mark designer"></span>
                              Designer
                            </div>
                            <div className="projectUpload__table_from_mark_item">
                              <span className="projectUpload__table_from_mark admin"></span>
                              Admin
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        className="projectUpload_file_list_cell"
                      >
                        <div
                          className={cx('projectUpload_file_list cloud', {
                            scroll: !!cloudFileList.value?.length && isScrollFileList,
                          })}
                        >
                          {cloudFileList.value?.length > 0 &&
                            cloudFileList.value.map((item, idx) => {
                              const isModelType = modelTypes.includes(item.type);
                              const isImageType = [...imgTypes].includes(item.type);
                              const isViewType = isModelType || isImageType || item.type === 'html';
                              const extensionSrc = fileExtensionList.includes(item.type)
                                ? require(`static/images/icons/icon_extension_${item.type}.svg`)
                                : require(`static/images/icons/icon_extension_etc.svg`);
                              // complete가 아닐경우 다운로드 불가 체크, downloadDirection은 백단에서 remake(reject된 파일)에 관해 null 줘서 체크
                              const downloadDisabled =
                                // isModelType &&
                                stage !== 4 && isSender && item.uploadUserType !== 'client';
                              const deleteDisabled =
                                (isSender && item.uploadUserType !== 'client') ||
                                (isReceiver && item.uploadUserType !== 'designer') ||
                                (isAdmin && item.uploadUserType !== 'admin');
                              const activeEyeColor = item.viewColor || color.blue;
                              const unactiveEyeColor = isViewType
                                ? color.gray_b5
                                : color.gray_deep_week;
                              const eyeIconColor = item.isView ? activeEyeColor : unactiveEyeColor;

                              return (
                                <Grid
                                  container
                                  alignItems="center"
                                  className="projectUpload_file_item_grid_container"
                                  key={item.cloudDataIdx}
                                >
                                  <Grid
                                    item
                                    container
                                    alignItems="center"
                                    justify="center"
                                    className="projectUpload__file_list_item_cell check_all"
                                  >
                                    <div>
                                      <label>
                                        <CustomCheckbox
                                          width={15}
                                          checked={item.isChecked}
                                          onChange={e =>
                                            onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'checkCloudFile',
                                            })
                                          }
                                        />
                                      </label>
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    container
                                    alignItems="center"
                                    className="projectUpload__file_list_item_cell filename"
                                  >
                                    <div>
                                      <img src={extensionSrc} alt={item.type} />

                                      <span
                                        className={cx('projectUpload__table_from_mark', {
                                          client: item.uploadUserType === 'client',
                                          designer: item.uploadUserType === 'designer',
                                          admin: item.uploadUserType === 'admin',
                                        })}
                                      ></span>
                                      <span
                                        className="text-overflow-ellipis projectUpload__file_list_item_text"
                                        title={item.originName}
                                      >
                                        {item.originName}
                                      </span>
                                      {/* - */}
                                      {/* <span
                                        className={cx('projectUpload__table_from_badge', {
                                          client: item.uploadUserType === 'client',
                                          designer: item.uploadUserType === 'designer',
                                        })}
                                      >
                                        {item.uploadUserType}
                                      </span> */}
                                    </div>
                                    <div className="projectUpload__file_list_item_date">
                                      {moment.unix(item.enrollDate).format('MMM. DD. YYYY')}
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    container
                                    alignItems="center"
                                    justify="flex-end"
                                    className="projectUpload__file_list_item_cell actions"
                                  >
                                    <div>
                                      <span className="vertical_division"></span>
                                      <>
                                        {(item.uploadState === 0 || item.uploadState === 1) && (
                                          <IconButton disabled>
                                            <CircularLoading size={15} />
                                          </IconButton>
                                        )}
                                        {item.uploadState === 2 && (
                                          <IconButton
                                            // disabled={downloadDisabled || !item.downloadDirectory}
                                            onClick={() =>
                                              onClickCloudFile(_, item.cloudDataIdx, {
                                                action: 'downloadCloudFile',
                                                value: {
                                                  name: item.originName,
                                                  isDownload: item.isDownload,
                                                  url: item.downloadDirectory,
                                                  disabled:
                                                    downloadDisabled || !item.downloadDirectory,
                                                },
                                              })
                                            }
                                          >
                                            {/* {stage === 4 ? ( */}
                                            {!(downloadDisabled || !item.downloadDirectory) ? (
                                              <>
                                                {item.isDownload ? (
                                                  <DownloadIcon width={16} color={color.gray_b5} />
                                                ) : (
                                                  <DownloadIcon width={16} color={color.blue} />
                                                )}
                                              </>
                                            ) : (
                                              // <CloudOffIcon htmlColor="#bdbdbd" />
                                              <DownloadIcon
                                                width={16}
                                                color={color.gray_deep_week}
                                              />
                                            )}
                                          </IconButton>
                                        )}
                                        {item.uploadState === 3 && (
                                          <IconButton disabled>
                                            {/* <CloudOffIcon htmlColor="#bdbdbd" /> */}
                                            <DownloadIcon width={16} color={color.gray_deep_week} />
                                          </IconButton>
                                        )}
                                      </>

                                      {hasViewer && (
                                        <IconButton
                                          disabled={!isViewType}
                                          onClick={() => {
                                            if (item.type === 'html') {
                                              return onClickCloudFile(_, item.cloudDataIdx, {
                                                action: 'toggleViewCloudHtmlFile',
                                                value: {
                                                  isView: item.isView,
                                                  url: item.viewDirectory,
                                                },
                                              });
                                            }
                                            if (imgTypes.includes(item.type)) {
                                              return onClickCloudFile(_, item.cloudDataIdx, {
                                                action: 'toggleViewCloudImageFile',
                                                value: {
                                                  isView: item.isView,
                                                  url: item.viewDirectory,
                                                },
                                              });
                                            }
                                            if (modelTypes.includes(item.type)) {
                                              return onClickCloudFile(_, item.cloudDataIdx, {
                                                action: 'toggleViewCloudModelFile',
                                                value: {
                                                  name: item.originName,
                                                  type: item.type,
                                                  isView: item.isView,
                                                  viewColor: item.viewColor,
                                                  url: item.viewDirectory,
                                                  resourceFileList: item.resourceFileList,
                                                  groupName: item.groupName,
                                                  // url: item.downloadDirectory,
                                                },
                                              });
                                            }
                                          }}
                                        >
                                          <EyeIcon width={18} color={eyeIconColor} />
                                        </IconButton>
                                      )}

                                      <IconButton
                                        disabled={deleteDisabled}
                                        onClick={() =>
                                          onClickCloudFile(_, item.cloudDataIdx, {
                                            action: 'deleteCloudFile',
                                            value: {
                                              name: item.originName,
                                            },
                                          })
                                        }
                                      >
                                        <TrashIcon
                                          width={14}
                                          color={
                                            deleteDisabled ? color.gray_deep_week : color.gray_b5
                                          }
                                        />
                                      </IconButton>
                                    </div>
                                  </Grid>
                                  {/* <Grid item container alignItems="center" className="projectUpload__file_list_item_cell upload">
                                      <MuiWrapper data-type="default">
                                        <Checkbox
                                          checked={item.checkUpload}
                                          color="primary"
                                          style={{ padding: 0 }}
                                          disabled
                                        />
                                      </MuiWrapper>
                                    </Grid> */}
                                </Grid>
                              );
                            })}
                        </div>
                      </Grid>
                    </div>
                  )}

                  {/* Local */}
                  <div className="projectUpload__table_body_local">
                    {isDetailPage && (
                      <Grid
                        item
                        container
                        alignItems="center"
                        justify="center"
                        className="projectUpload__table_group"
                      >
                        <div className="projectUpload__table_check_all_box">
                          <span className="label">
                            {viewType === 'modal' ? (
                              <>
                                To <br /> Upload
                              </>
                            ) : (
                              'Local'
                            )}
                          </span>
                        </div>
                      </Grid>
                    )}
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectUpload_file_list_cell"
                    >
                      <DropzoneWrapper apiRequest={onAddLocalFiles}>
                        <div className="projectUpload_file_list local">
                          {useMemo(
                            () => (
                              <>
                                {localFileListCt.value?.length > 0 &&
                                  localFileListCt.value.map((item, idx) => {
                                    const isViewType = modelTypes.includes(item.type);
                                    const extensionSrc = fileExtensionList.includes(item.type)
                                      ? require(`static/images/icons/icon_extension_${item.type}.svg`)
                                      : require(`static/images/icons/icon_extension_etc.svg`);
                                    // const isNoBorderBottom =
                                    //   idx >= 6 && idx === localFileListCt.value.length - 1;
                                    return (
                                      <Grid
                                        container
                                        alignItems="center"
                                        className="projectUpload_file_item_grid_container"
                                        key={item.id}
                                      >
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          justify="center"
                                          className="projectUpload__file_list_item_cell check_all"
                                        >
                                          <div>
                                            <label>
                                              <CustomCheckbox
                                                width={15}
                                                checked={checkAllLocal.value}
                                                onChange={checkAllLocal.onChange}
                                              />
                                            </label>
                                          </div>
                                        </Grid>
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          className="projectUpload__file_list_item_cell filename"
                                        >
                                          <div>
                                            <img src={extensionSrc} alt={item.type} />

                                            <span
                                              className="text-overflow-ellipis projectUpload__file_list_item_text"
                                              title={item.name}
                                            >
                                              {item.name}
                                            </span>
                                          </div>
                                        </Grid>
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          justify="flex-end"
                                          className="projectUpload__file_list_item_cell actions"
                                        >
                                          <span className="vertical_division"></span>
                                          <div>
                                            <IconButton
                                              // style={{ padding: 0 }}
                                              onClick={() =>
                                                onClickLocalFile(_, item.id, {
                                                  action: 'deleteLocalFile',
                                                  // value: { ref: localFileInputRef },
                                                })
                                              }
                                            >
                                              {/* <DeleteIcon htmlColor={color.red_icon} /> */}
                                              <TrashIcon />
                                            </IconButton>
                                          </div>
                                        </Grid>
                                        {/* <Grid item className="projectUpload__file_list_item_cell upload">
                                    <MuiWrapper data-type="default">
                                      <Checkbox
                                        checked={item.checkUpload}
                                        color="primary"
                                        style={{ padding: 0 }}
                                        onChange={e =>
                                          onClickLocalFile(e, item.id, {
                                            action: 'checkLocalFile',
                                          })
                                        }
                                      />
                                    </MuiWrapper>
                                  </Grid> */}
                                      </Grid>
                                    );
                                  })}

                                {!localFileListCt.value?.length && (
                                  <label
                                    // htmlFor="localFileInput"
                                    onClick={() => localFileInputRef.current.click()}
                                    className="projectUpload__table_file_open_btn_box cursor-pointer"
                                  >
                                    <div className="projectUpload__table_file_open_in_box">
                                      <img
                                        src={icon_folder_plus}
                                        alt="folder open"
                                        className="icon"
                                      />{' '}
                                      <div className="projectUpload__table_file_open_info_box">
                                        {/* <span className="projectUpload__table_file_open_btn add">
                                          + <T>GLOBAL_ADD_FILES</T>
                                        </span>{' '}
                                        <span className="projectUpload__table_file_open_btn drag">
                                          <T>GLOBAL_DRAG_DROP</T>
                                        </span>{' '}
                                        <span className="projectUpload__table_file_open_btn click">
                                          <T>GLOBAL_CLICK</T>
                                        </span> */}
                                        <span className="projectUpload__table_file_open_btn drag">
                                          <T>GLOBAL_DRAG_DROP</T>
                                          {', '}
                                        </span>
                                        <span className="projectUpload__table_file_open_btn click">
                                          <T>GLOBAL_BROWSE_FILES</T>
                                        </span>{' '}
                                        <p className="projectUpload__table_file_open_notice">
                                          <T>GLOBAL_FILE_UPLOAD_INFO</T>
                                        </p>
                                      </div>
                                    </div>
                                  </label>
                                )}
                              </>
                            ),
                            [localFileListCt.value],
                          )}
                        </div>
                      </DropzoneWrapper>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="file"
              multiple
              name="localFileInput"
              id="localFileInput"
              ref={localFileInputRef}
              onChange={localFileInput.onChange}
              hidden
            />
            {/* <button className="projectUpload__table_file_plus_btn btn-reset">
            <label htmlFor="localFileInput" className="cursor-pointer">
              <img src={icon_folder_plus} alt="folder plus" className="icon" />
            </label>
          </button> */}
            {!!localFileListCt.value?.length && (
              <button
                className="projectUpload__table_file_plus_btn btn-reset"
                onClick={() => localFileInputRef.current.click()}
              >
                <img src={icon_folder_plus} alt="folder plus" className="icon" />
              </button>
            )}
          </div>
          {/* {isCreatePage && (
              <div className="projectUpload__file_open_btn_box">
                <input
                  type="file"
                  multiple
                  name="localFileInput"
                  id="localFileInput"
                  onChange={localFileInput.onChange}
                  hidden
                />
                <MuiButton
                  data-type="label"
                  disableElevation
                  variant="outlined"
                  color="primary"
                  className="sm projectUpload__file_open_btn"
                >
                  <label htmlFor="localFileInput" className="cursor-pointer">
                    <img src={icon_folder_open} alt="folder open" className="icon" /> Open
                  </label>
                </MuiButton>
              </div>
            )} */}
          {hasUpload && (
            <div className="projectUpload__submit_box">
              {/* <>
                <MuiButton
                  data-type="label"
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="sm"
                  onClick={() => handleUploadLocalFile()}
                >
                  <PublishIcon />
                  <T>GLOBAL_UPLOAD</T>
                </MuiButton>
              </> */}
              {(!isReceiver || (isReceiver && stage >= 2)) && (
                <>
                  <MuiButton
                    data-type="label"
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="sm"
                    onClick={() => handleUploadLocalFile()}
                  >
                    <PublishIcon />
                    <T>GLOBAL_UPLOAD</T>
                  </MuiButton>
                </>
              )}
            </div>
          )}
          {/* <button className="projectUpload__table_file_plus_btn btn-reset">
            <img src={icon_folder_plus} alt="folder plus" className="icon" />
          </button> */}
        </Grid>
      </Grid>
    </Styled.ProjectUpload>
  );
});

const checkboxWidth = 20; // 40
const Styled = {
  ProjectUpload: styled.div`
    /* margin-top: 10px; */
    /* padding: 0 8px; */
    .projectUpload__grid_container {
      &.detail {
      }
      .projectUpload__grid_item {
        &.table {
        }
        &.viewer {
          margin-bottom: 10px;
        }
      }
      .projectUpload__grid_item {
        position: relative;
        justify-content: flex-end;
      }
    }

    /* 사용X */
    .projectUpload__file_open_box {
      margin-bottom: 10px;
      text-align: right;
    }
    .projectUpload__file_open_btn_box {
      display: inline-block;
      .projectUpload__file_open_btn {
        padding: 0;
        label {
          padding-left: 10px;
          padding-right: 10px;
          img {
            margin-right: 5px;
          }
        }
      }
    }

    .projectUpload__table_wrapper {
      position: relative;
      width: 100%;
    }
    .projectUpload__table_container {
      position: relative;
      &:before {
        /* content: ''; */
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 7px;
        height: 100%;
        background-color: #ddd;
      }
      .projectUpload__table {
        position: relative;
      }

      .projectUpload__table_head {
      }
      .projectUpload__table_body {
        overflow-x: hidden;
      }
      .projectUpload__table_head,
      .projectUpload__table_body_cloud,
      .projectUpload__table_body_local {
        display: flex;
      }
      .projectUpload__table_head {
        .projectUpload__table_group {
          color: white;
        }
      }
      .projectUpload__table_body_cloud {
      }
      .projectUpload__table_body_local {
        display: ${({ viewType, isEdit }) => viewType === 'modal' && !isEdit && 'none'};
        border-top: 1px solid ${color.gray_b5};
      }
      .projectUpload__table_group {
        position: relative;
        width: 12%;
        border-right: 1px solid ${color.gray_b5};
        font-size: 14px;

        .projectUpload__table_check_all_box {
          position: relative;
          text-align: center;
        }
        .projectUpload__table_from_mark_list {
          position: absolute;
          top: 25px;
          left: -15px;
          font-size: 12px;
          white-space: nowrap;
          .projectUpload__table_from_mark_item {
            display: flex;
            align-items: center;
            &:not(:first-child) {
              margin-top: 2px;
            }
          }
        }
      }
      .projectUpload__table_from_mark {
        display: inline-block;
        position: relative;
        top: 1px;
        width: 8px;
        height: 8px;
        margin-right: 3px;
        border-radius: 50%;
        &.client {
          background-color: ${color.client_color};
        }
        &.designer {
          background-color: ${color.designer_color};
        }
        &.admin {
          background-color: ${color.admin_color};
        }
      }

      /* file list grid cell in table */
      .projectUpload_file_list_cell {
        width: ${({ isDetailPage }) => (isDetailPage ? '88%' : '100%')};
        padding: 0;
      }
      .projectUpload_file_list {
        position: relative;
        overflow-y: overlay;
        width: 100%;
        &.head {
        }
        &.cloud,
        &.local {
          /* height: 287px; */
          /* height: 205px; */
          height: ${({ isDetailPage }) => (isDetailPage ? '205px' : '287px')};
          .projectUpload_file_item_grid_container {
            border-bottom: 1px dashed ${color.gray_b5};
          }
        }
        &.cloud {
          height: ${({ viewType }) => viewType === 'modal' && '340px'};
          height: ${({ viewType, isEdit }) => viewType === 'modal' && !isEdit && '562px'};
        }
        &.local {
          height: ${({ viewType }) => viewType === 'modal' && '221px'};
        }
        .projectUpload_file_item_grid_container {
          align-items: center;
        }
        .projectUpload__file_list_item_cell {
          position: relative;
          display: flex;
          /* width: 10%; */
          padding: 0 5px;
          height: 40px;
          > div {
            display: flex;
            align-items: center;
            line-height: 1.3;
          }
          &.check_all {
            width: ${checkboxWidth}px;
            label {
              display: none;
            }
          }
          &.filename {
            justify-content: flex-start;
            width: 79%;
            width: ${({ viewType }) => viewType === 'modal' && '85%'};
            height: 30px;
            padding-right: 80px;
            img:first-of-type {
              margin-right: 10px;
            }
            .projectUpload__file_list_item_text {
              display: inline-block;
              max-width: ${({ viewType }) => (viewType === 'modal' ? 500 : 450)}px;
            }
            .projectUpload__file_list_item_date {
              position: absolute;
              top: 50%;
              right: 5px;
              transform: translateY(-50%);
              font-size: 12px;
              color: ${color.gray_b5};
              font-weight: 300;
            }
          }
          &.type {
            .projectUpload__view_icon {
              color: ${color.blue};
              padding: 0;
            }
          }
          &.actions {
            width: ${`calc(21% - ${checkboxWidth}px)`};
            width: ${({ viewType }) => viewType === 'modal' && `calc(15% - ${checkboxWidth}px)`};
            button {
              padding: 0;
              width: 38px;
              height: 38px;
            }
          }

          .vertical_division {
            display: inline-block;
            position: relative;
            margin-left: -1px;
            left: -5px;
            height: 40px;
            border-left: 1px dashed ${color.gray_b5};
          }
          .projectUpload__table_from_badge {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 3px;
            height: 18px;
            padding: 0px 8px;
            border-radius: 15px;
            font-size: 12px;
            color: #fff;
            &.client {
              background-color: ${color.navy_blue};
            }
            &.designer {
              background-color: ${color.blue};
            }
          }
        }
      }

      .projectUpload__table.create {
        .projectUpload_file_list .projectUpload__file_list_item_cell {
          &.filename {
            width: 80%;
          }
          &.actions {
            width: ${`calc(20% - ${checkboxWidth}px)`};
          }
        }
      }

      .projectUpload__table_head {
        background-color: ${({ theme }) => theme.color.secondary};
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border: 1px solid transparent;
        .projectUpload__file_list_item_cell {
          min-height: 35px;
          font-size: 14px;
          color: white;
        }
      }
      .projectUpload__table_body {
        border: 1px solid ${color.gray_b5};
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        .projectUpload__file_list_item_cell {
          font-size: 13px;
          &:first-child {
          }
          &:last-child {
          }
        }
      }
    }
    .projectUpload__viewer_box {
      position: relative;
      width: 100%;
      height: 425px;
      background-color: #fbfbfb;
      border: 1px dotted ${color.gray_b5};
      border-radius: 10px;
      overflow: hidden;
    }
    .projectUpload__htmlViewer,
    .projectUpload__modelViewer {
      /* margin: 0 auto; */
    }
    .projectUpload__htmlViewer {
      overflow-y: auto;
      &,
      iframe {
        width: 838px;
        height: 425px;
      }
      iframe {
      }
    }
    .projectUpload__imageViewer {
      img {
        width: 838px;
        height: 425px;
      }
    }
    .projectUpload__submit_box {
      margin-top: 10px;
      /* & > *:not(:first-child) {
        margin-left: 5px;
      } */
    }
    .projectUpload__table_file_open_btn_box {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-left: 55px;
      /* background-color: #fff; */
      .projectUpload__table_file_open_in_box {
        display: flex;
        align-items: center;
        .projectUpload__table_file_open_info_box {
          margin-left: 20px;
          font-size: 14px;
          line-height: 1.15;
          text-align: left;
        }
      }
      label {
        display: inline-flex;
        align-items: center;
      }
      .projectUpload__table_file_open_btn {
        &:not(:first-of-type) {
        }
        &.add {
        }
        &.drag,
        &.click {
          color: #bababa;
        }
        &.drag {
        }
        &.click {
          text-decoration: underline;
        }
      }
      .projectUpload__table_file_open_notice {
        color: ${color.blue};
      }
    }
    .projectUpload__table_file_plus_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0px;
      right: 0px;
      transform: translateX(50%);
      width: 38px;
      height: 38px;
      background-color: ${color.navy_blue};
      /* background-color: #fff; */
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      img {
        position: relative;
        left: 4px;
        bottom: 5px;
        width: 38px;
        height: 38px;
      }
    }
  `,
};

/* <FileUploadButton
// onChange={}
>
  <MuiButton>
    <img src={icon_folder_open} alt="folder open" /> Open
  </MuiButton>
</FileUploadButton> 
*/
// TODO: 재사용 컴포넌트로 개발, 단일 파일, 다중 파일 타입별 사용할 수 있는 컴포넌트로 개발
// export const FileUploadButton = React.memo(function FileUploadButton({ value, onChange }) {});
/* viewModelFile.setValue({
                    isView: !isView,
                    file: 'file',
                    name,
                    url: isValidObj ? `${url}&token=${accessToken}` : null,
                    textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
                    mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
                  }); */
/* TEST: */
/* <ProjectModelViewer
  model={{
    isView: true,
    name: 'stl',
    url: [
      `http://15.164.27.98:31810/bridge/bin/v1/project/view?fileName=2e35009db36e074298cefbef7cf82f3451eb33851c301cc0e28be77d66041a8c&token=${accessToken}`,
      `http://15.164.27.98:31810/bridge/bin/v1/project/view?fileName=7ca15f91eeadb0317fbdb373d1888e7c94f21b9fd6160ef6ae1407698ac8da33&token=${accessToken}`,
      `http://15.164.27.98:31810/bridge/bin/v1/project/view?fileName=602e4d2d4f820987c97a20c2f807e1281d837050bee4a5cb80a3ebac49ee49c2&token=${accessToken}`,
      // `http://15.164.27.98:31810/bridge/bin/v1/project/view?fileName=ff7c7ae68a5e18c0c48546aed591c801d96c1247d41f795b0db0b7baa00dedf8&token=${accessToken}`,
      // `http://15.164.27.98:31810/bridge/bin/v1/project/view?fileName=d2b1f2e09fe9647c3020ca21d10f9bec3e4f98be55b3d639414ee4f778e7088c&token=${accessToken}`,
    ],
  }}
  className="projectUpload__modelViewer"
/> */
