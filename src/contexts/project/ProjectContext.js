import useInput from 'lib/hooks/useInput';
import { cutUrl } from 'lib/library';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { AppActions, BinActions } from 'store/actionCreators';

export const ProjectContext = createContext();

// ProjectUploadContainer 와 CreateProjectContainer, ProjectContainer, 를 Provider로서 state 관리
export function ProjectProvider({ value, children }) {
  const {
    user,
    accessToken,
    projectFilesData,
    projectInfo,
    uploadProjectFileSuccess,
    fetchProjectSuccess,
  } = useShallowSelector(state => ({
    user: state.user.user,
    accessToken: state.auth.accessToken,
    projectFilesData: state.project.projectFiles.data,
    // projectFileList: state.project.projectFiles.data?.fileList,
    projectInfo: state.project.project.data?.projectInfo,
    fetchProjectSuccess: state.project.project.success,
    uploadProjectFileSuccess: state.bin.uploadProjectFile.success,
  }));
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const isCreatePage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/create';
  const isCreateEditPage = ['project/create', 'project/edit'].includes(
    `${cutUrl(pathname)}/${cutUrl(pathname, 1)}`,
  );
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  const history = useHistory();
  // const queryParse = queryString.parse(search);
  // const queryProjectCode = queryParse?.projectCode;
  const userCode = user?.userCode;
  const company = user?.company;
  const projectCode = projectInfo?.projectCode;
  const isSender = userCode === projectInfo?.senderCode;
  const isReceiver = userCode === projectInfo?.receiverCode;
  const isAdmin = userCode === projectInfo?.adminCode;
  const projectFileList = projectFilesData?.fileList;
  const hasNewProjectUploadFile = projectFilesData?.hasNewFile;

  // const stage = projectInfo?.stage;
  // const senderCode = projectInfo?.senderCode;
  // const [isConnect, setIsConnect] = useState(null);
  // const [projectEvent, setProjectEvent] = useState({
  //   eventType: null,
  //   result: null,
  // });
  // const [chatResponse, setChatResponse] = useState([]);
  // const [chatList, setChatList] = useState([]);

  // const fromActionCt = useInput('matching');
  // const fromActionCt = useInput('');
  // 프로젝트 Create(Save)한 후 fileUplaod 를 위한 projectCode, editSuccess이후 전달받음, stage 진행시 별도 테이블에서 파일 요청시 필요함
  const projectCodeCt = useInput('');
  // Upload Component localFileList
  const localFileListCt = useInput([]);
  // fetchProject data 안에 fileList를 담아서 UploadTable로 전달용
  const [cloudFileListCtValue, setCloudFileListCtValue] = useState([]);

  // projectFileList data연동
  const cloudFileListCt = useMemo(() => {
    // NOTE: state사용시 기본값을 넣어주기, fetchData(selector)에 넣어주면([], {}) 랜더링 횟수 추가되어 loop발생 가능
    // console.log('cloudFileListCt projectFileList', projectFileList);
    // console.log('cloudFileListCtValue', cloudFileListCtValue);
    setCloudFileListCtValue(projectFileList);

    return {
      value: cloudFileListCtValue || [],
      setValue: setCloudFileListCtValue,
    };
  }, [projectFileList, cloudFileListCtValue]);

  // TEST:
  // useEffect(() => {
  //   console.log('-localFileListCt.value', localFileListCt.value);
  // }, [localFileListCt.value]);
  // useEffect(() => {
  //   console.log('-cloudFileListCt.value', cloudFileListCt.value);
  // }, [cloudFileListCt.value]);
  // useEffect(() => {
  //   console.log('-projectCodeCt.value', projectCodeCt.value);
  // }, [projectCodeCt.value]);

  // NOTE: 중복 파일 확인시 handleUploadLocalFile 호출 전에 확인용
  const handleCreateMatchingUploadUserData = () => {
    const matchingUploadUserTypeData = data => {
      return data.find(
        item =>
          (isSender && item?.uploadUserType === 'client') ||
          (isReceiver && item?.uploadUserType === 'designer') ||
          (isAdmin && item?.uploadUserType === 'admin'),
      );
    };

    // cloudFile과의 matching cloudDataIdx를 찾기 위해
    const localFileListData = localFileListCt.value?.map(item => {
      const { name, file } = item;
      const cloudData = cloudFileListCt.value?.filter(cloudFile => cloudFile.originName === name);
      console.log('cloudData', cloudData);
      const machingData = matchingUploadUserTypeData(cloudData);
      console.log('machingData', machingData);
      return {
        cloudDataIdx: machingData?.cloudDataIdx || null,
        file,
        uploadUserType: machingData?.uploadUserType,
      };
    });

    return localFileListData;
  };

  // NOTE: done, remake, uploadLocalFile 등의 함수 실행전 파일 중복여부 확인시 사용
  const handleCheckExistingUploadUserFile = callback => {
    const localFileListData = handleCreateMatchingUploadUserData();
    const existingCloudFile = localFileListData?.find(item => item.cloudDataIdx);
    // console.log('existingCloudFile', existingCloudFile);

    if (!!existingCloudFile) {
      return AppActions.add_popup({
        isOpen: true,
        content: t('MODAL_FILE_DUPLICATE'),
        isCloseIcon: true,
        onClick() {
          callback();
        },
      });
    }

    callback();
  };

  // NOTE: handleUploadLocalFile은 handleCheckExistingUploadUserFile를 거쳐서 실행
  // createPage, detailPage에서 사용가능하도록 Context에 등록
  const handleUploadLocalFile = id => {
    // if (!data) data = { id: '', isRemake: false };
    // const { id, isRemake } = data;

    // console.log('cloudFileListCt.value', cloudFileListCt.value);
    console.log('localFileListCt.value', localFileListCt.value);
    const hasFile = localFileListCt.value?.length > 0;

    const projectCodeValue = isCreatePage ? id : projectCode;
    if (!projectCodeValue)
      return AppActions.show_toast({ type: 'error', message: 'Bad Request 400' });

    // if (!isRemake && !hasFile)
    // if (!hasFile)
    //   return AppActions.show_toast({ type: 'error', message: 'Check your upload files' });

    const localFileListData = handleCreateMatchingUploadUserData();
    // console.log('localFileListData', localFileListData);
    if (!localFileListData?.length) return;

    const submitData = {
      company,
      projectCode: projectCodeValue,
      // project: localFileListCt.value.map(item => item.file),
      project: localFileListData,
    };

    // console.log('uploadLocalFile submit');
    BinActions.upload_project_file_request(submitData);
  };

  // NOTE: 파일이름 중복을 막을 경우
  // const uploadPossible =
  //   (isSender && existingCloudFile?.uploadUserType === 'client') ||
  //   (isReceiver && existingCloudFile?.uploadUserType === 'designer') ||
  //   (isAdmin && existingCloudFile?.uploadUserType === 'admin');
  // console.log('uploadPossible', uploadPossible);
  // if (!uploadPossible) {
  //   return AppActions.add_popup({
  //     isOpen: true,
  //     content: t('MODAL_FILE_DUPLICATE_NOT_OWNER'),
  //     isCloseIcon: true,
  //   });
  // }

  // project 변경시 마다 초기화 FileListCt 초기화
  useDidUpdateEffect(() => {
    console.log('ALL FileListCt Init');
    // cloudFileListCt.setValue([]);
    localFileListCt.setValue([]);
  }, [projectCode]);

  // NOTE: project create page, edit page에서 파일 업로드 성공 후 detail page 이동
  // request project file, response
  useDidUpdateEffect(() => {
    if (uploadProjectFileSuccess) {
      console.log('uploadProjectFileSuccess');
      // 성공시 초기화(list reset)
      localFileListCt.setValue([]);
      if (isCreateEditPage) {
        // createPage에서 Create버튼 눌른 후 page이동(detailPage이동 후 fetchProject에서 fileList를 가지고옴)
        console.log('createPage');
        console.log('projectCodeCt.value', projectCodeCt.value);
        // history.push(`${pageUrl.project.detail}?projectCode=${projectCodeCt.value}`);
        history.push(`/project/detail/${projectCodeCt.value}`);
      } else {
        // Upload후 파일 fet는 store/bin에서 관리
        // detailPage에서 Uplaod버튼 눌른 후 fetch ProjectFiles
        // console.log('not createPage');
        // console.log('queryProjectCode', queryProjectCode);
        // ProjectActions.fetch_project_files_request({ projectCode: queryProjectCode });
      }
    }
  }, [uploadProjectFileSuccess === true]);

  // projectFiles data연동
  // useEffect(() => {
  //   if (!!projectFiles) cloudFileListCt.setValue(projectFiles);
  // }, [projectFiles]);
  // cloudFileListCt

  return (
    <ProjectContext.Provider
      value={{
        // fromActionCt,
        projectCodeCt,
        localFileListCt,
        cloudFileListCt,
        hasNewProjectUploadFile,
        onCheckExistingUploadUserFile: handleCheckExistingUploadUserFile,
        onUploadLocalFile: handleUploadLocalFile,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

// export const useProjectContextValue = () => {
//   const value = useContext(ProjectContext);
//   return value;
// };
