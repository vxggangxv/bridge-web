import useInput from 'lib/hooks/useInput';
import { cutUrl } from 'lib/library';
import { projectEventType } from 'lib/mapper';
import { BASE_SOCKET_PROJECT_URL } from 'lib/setting';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import _ from 'lodash';
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import store from 'store';
import { AppActions, DesignerActions, ProjectActions } from 'store/actionCreators';

export const ProjectSocketContext = createContext();

// ProjectSocketPage, ProjectUpdate, Chat 관련 socket Provider
export function ProjectSocketProvider({ value, children }) {
  const {
    user,
    projectInfo,
    accessToken,
    fetchProjectSuccess,
    attendDesignerList,
    fetchAttendDesignersSuccess,
  } = useShallowSelector(state => ({
    user: state.user.user,
    projectInfo: state.project.project.data?.projectInfo,
    accessToken: state.auth.accessToken,
    fetchProjectSuccess: state.project.project.success,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
    fetchAttendDesignersSuccess: state.designer.attendDesigners.success,
  }));
  const { pathname, search } = useLocation();
  const history = useHistory();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  // const queryParse = queryString.parse(search);
  // const queryProjectCode = queryParse?.projectCode;
  const userCode = user?.userCode;
  const company = user?.company;
  const userType = projectInfo?.userType;
  // const projectCode = pcode;
  const projectCode = projectInfo?.projectCode;
  const receiverCode = projectInfo?.receiverCode;
  const senderCode = projectInfo?.senderCode;
  const stage = projectInfo?.stage;
  // TODO: 매핑, projectStatus 및 상태
  // projectEmptyMatchingStatus : {
  //   giveup: "GIVEUP",
  //   designerChange : "CHANGE",
  //   designerSelectReject : "REJECT",
  //   projectRenew : "RENEW",
  //   designerExpired : "EXPIRED"
  // }
  const projectStatus = projectInfo?.projectStatus;
  // const isClient = userCode === projectInfo?.senderCode;
  // socket state
  // const [socketState, setSocketState] = useState(null);
  const socketState = useRef(null);
  const isRefresh = useInput(false);
  // 초기값 null, connect: true, disconnect: false, socket.open() 용도
  const [isConnect, setIsConnect] = useState(null);
  // cancelApply 확인 값
  const isCancelApply = useInput(null);
  // const [isOpenSocket, setIsOpenSocket] = useState(null);
  // const [isCloseSocket, setIsCloseSocket] = useState(null);
  // const [isDisConnect, setIsDisConnect] = useState(false);
  const [chatResponseStatus, setChatResponseStatus] = useState(null);
  const [projectEvent, setProjectEvent] = useState({
    eventType: null,
    result: null,
  });
  const [chatData, setChatData] = useState([]);
  const [chatListData, setChatListData] = useState({});
  const chatListRequestPossible = useInput(true);
  const [chatListAllItems, setChatListAllItems] = useState([]);
  const [isFirstFetchChatList, setIsFirstFetchChatList] = useState(true);
  const [lastUnreadMessageId, setLastUnreadMessageId] = useState(null);
  // projectJoin 시 참가자 userCode, company담은 배열
  const [participant, setParticipant] = useState(null);
  const [participantCount, setParticipantCount] = useState(null);
  // projectEvent에 따른 response data
  const [chatUserData, setChatUserData] = useState(null);
  const [updateProjectData, setUpdateProjectData] = useState(null);
  const [applyDesignerData, setApplyDesignerData] = useState(null);

  // project/detail 페이지 에서 socket 연결, 최초 한번 실행
  useEffect(() => {
    let socket;
    // detail 페이지 입장 시 socket자동 연결
    if (isDetailPage && projectCode) {
      console.log('project socket open');
      socket = io(BASE_SOCKET_PROJECT_URL, {
        path: '/notification/socket.io',
        autoConnect: false,
        reconnectionDelayMax: 10000,
        auth: { 'x-access-token': store.getState().auth.accessToken },
      });
      socket.open();
      socketState.current = socket;

      socket.on('connect', () => {
        console.log('project socket connect_', socket.id, socket.connected);
        // socket.open();
        setIsConnect(socket.connected);
        handleJoinProject();
      });
      socket.on('disconnect', () => {
        console.log('project socket connect_dis', socket.connected);
        // console.log('socket.id', socket.id);
        // socket.open();
        setIsConnect(socket.connected);
      });
      socket.on('connect_error', error => {
        console.log('project socket connect_error', error);
        // setIsCloseSocket(true);
        socket.close();
      });

      // socket projectEvent에 따른 분기
      // 각 event별 state별도로 분리, designer만 통합
      /**
       *  designerEnter: "DESIGNER_ENTER",
       *  projectUpdate: "PROJECT_UPDATE",
       *  designerLeave: "DESIGNER_LEAVE",
       *  applyDesigner: "APPLY_DESIGNER",
       */
      socket.on('projectEvent', data => {
        console.log(socket.id, ' projectEvent ', data);
        const { eventTypeIdx, eventType, userCode: chatUserCode, result = null } = data;
        console.log('eventType', eventType);
        // console.log('projectEvent.designerEnter', projectEvent.designerEnter);
        if (result === 500) setChatResponseStatus(result);
        if (eventType === projectEventType.userEnter) {
          console.log('enter user');
          setParticipantCount(result?.participantCount || 1);
          setParticipant(result?.participant);
          setChatUserData(draft => ({ ...draft, ...data }));
          // setChatUserData(draft => ({ ...draft, eventType, userCode: chatUserCode, result }));
          // setEnterDesignerData({ eventType, userCode: chatUserCode, result });
          const company =
            result?.participant &&
            _.find(result?.participant, item => item.userCode === chatUserCode)?.company;
          console.log('chatUserCode', chatUserCode);
          console.log('company', company);
          // newUser표시
          setChatData(draft =>
            // draft.concat({
            //   sender: chatUserCode,
            //   eventType: 'enter',
            //   company,
            // }),
            [
              {
                sender: chatUserCode,
                eventType: 'enter',
                company,
              },
              ...draft,
            ],
          );
        }
        if (eventType === projectEventType.userLeave) {
          console.log('leave user');
          setParticipantCount(data?.result?.participantCount);
          // setChatUserData(draft => ({ ...draft, ...data }));
          // setChatUserData(draft => ({ ...draft, eventType, userCode: chatUserCode, result }));
          // setLeaveDesignerData({ eventType, userCode: chatUserCode, result });
          setChatData(draft =>
            // draft.concat({
            //   sender: chatUserCode,
            //   eventType: 'leave',
            //   company: '',
            // }),
            [
              {
                sender: chatUserCode,
                eventType: 'leave',
                company: '',
              },
              ...draft,
            ],
          );
        }
        if (eventType === projectEventType.projectUpdate) {
          // apply - stage 0상태
          // accept - stage 0 -> 1
          // working - stage 1 -> 2
          // reject - stage 1 -> clientInfo: null -> client에게 검은 화면 및 프로젝트 상태 알림
          // done - stage 2 -> 3
          // giveup - stage 2 -> clientInfo: null -> client에게 검은 화면 및 프로젝트 상태 알림
          // confirm - stage 3 -> 4
          // rework - stage 3 -> 2
          // changeDesigner - stage 3 -> new -> designer는 result 403 체크(알림 후 history.goBack())
          // cancel - stage 3 -> delete project -> designer는 stage 3, resultStatus 404체크(알림 추가)
          // evaluate 는 Success로 설정
          // TODO: 세분화
          // NOTE: attendDesigner flow
          // 1: applying designer list(attendDesigners), 2: selected designer list, 3: matched designer list(attendDesigners)
          // 1 ->  (1 - 2) -> 3
          console.log('update project data', data);
          const projectCodeValue = data?.projectCode || projectCode;
          console.log('projectCodeValue', projectCodeValue);
          // setUpdateProjectData({ eventType, userCode: chatUserCode, result });
          setUpdateProjectData({ ...data });
          if (projectCodeValue) {
            ProjectActions.fetch_project_request({ projectCode: projectCodeValue });
            ProjectActions.fetch_projects_request({
              keyword: '',
              order: 0,
              page: 1,
            });
            ProjectActions.fetch_project_histories_request({ projectCode: projectCodeValue });
            // 2: invite
            // 15: cancel invite
            // 9: reject
            // 4: giveUp
            // const refreshAttendDesignersEventTypeIdxList = [2, 15, 9, 4];
            // if ([2, 15, 4].includes(eventTypeIdx)) {
            //   DesignerActions.fetch_attend_designers_request({ projectCode: projectCodeValue });
            // }
            // if ([9].includes(eventTypeIdx)) {
            //   DesignerActions.fetch_select_designers_request({ projectCode: projectCodeValue });
            // }
          }
        }
        if (eventType === projectEventType.applyDesigner) {
          setApplyDesignerData({ ...data });
          console.log('apply designer');
          // request api get 참석 디자이너
        }
      });
      console.log('socket ', socket);

      // 채팅입력 후 response
      socket.on('chatResponse', data => {
        console.log(socket.id, ' chatResponse payload', data);
        setChatData(draft =>
          // draft.concat({
          //   ...data,
          //   eventType: 'message',
          //   company: '',
          // }),

          [
            {
              ...data,
              eventType: 'message',
              company: '',
            },
            ...draft,
          ],
        );
      });

      // 이전 채팅 리스트 불러오기
      socket.on('chatList', data => {
        console.log('chatList ', data);
        chatListRequestPossible.setValue(true);
        // const {
        //   docs,
        //   hasNextPage,
        //   hasPrevPage,
        //   limit,
        //   nextPage,
        //   page,
        //   pagingCounter,
        //   prevPage,
        //   totalDocs,
        //   totalPages,
        // } = data;
        setChatListData(data);

        const docs = data?.docs;
        // let lastId = data?.page === 1 && docs[docs?.length - 1]?._id;
        const lastId =
          data?.page === 1 && docs?.length > data?.defaultChatCount && docs[docs?.length - 1]._id;
        if (lastId) setLastUnreadMessageId(lastId);

        const chatListDataItems =
          docs?.reduce((acc, curr) => {
            curr = {
              ...curr,
              eventType: 'message',
              company: '',
            };

            return acc.concat(curr);
          }, []) || [];
        // .reverse() || [];

        console.log('chatListDataItems', chatListDataItems);
        // setChatListAllItems(draft => [...draft, ...chatListDataItems]);
        setChatData(draft => [...draft, ...chatListDataItems]);
      });

      socket.on('event', data => {
        console.log('event', data);
      });
    } else {
    }
  }, [isDetailPage, projectCode]);

  // 처음 랜더링시의 chatList값만 사용
  // useEffect(() => {
  //   if (isFirstFetchChatList === true) {
  //     console.log('chatListData', chatListData);
  //     // setIsFirstFetchChatList(draft => {
  //     //   if (draft) lastId = docs[docs?.length - 1]._id;
  //     //   return draft;
  //     // });
  //     // // const lastId = docs?.length > 10 && docs[docs?.length - 1]._id;
  //     // let lastId = null;
  //     // setLastUnreadMessageId(lastId);
  //     // setIsFirstFetchChatList(false);
  //   }
  // }, [isFirstFetchChatList, chatListData]);

  // Project Detail을 벗어나는 시점
  // 시점 중요, chatLeave이후 close가 실행되도록 시점을 잡아야함.
  // 자동 lave chat, socket close
  useEffect(() => {
    // socket이 있을 경우는 detailPage에 projectCode를 가지고 있었을 경우, 나올 경우에 가지고 있음
    if (!isDetailPage & !!socketState.current) {
      console.log('project socket close');
      socketState.current.emit('chatLeave', {
        userCode,
        projectCode,
      });
      socketState.current.close();
    }
    // 초기화
    setChatData([]);
    setChatUserData(null);
    setChatListData({});
    setChatListAllItems([]);
  }, [isDetailPage, !!socketState.current]);

  // TEST:
  useEffect(() => {
    console.log('chatData', chatData);
  }, [chatData]);

  // disconnect이후 재연결
  // useDidUpdateEffect(() => {
  //   if (isDetailPage && !isConnect) return socket.open();
  // }, [isDetailPage, isConnect]);

  // 채팅방 아웃
  const handleLeaveChat = useCallback(
    (data = {}) => {
      // const { isClose = false, userCode, projectCode } = data;
      // const { isClose = false } = data;
      if (!userCode || !projectCode) {
        return AppActions.show_toast({ type: 'error', message: 'Bad Request 400' });
      }

      setChatData([]);
      console.log('socketState', socketState);
      console.log('before chatLeave socketState', socketState);
      if (!!socketState.current) {
        console.log('socket emit chatLeave', socketState.id);
        socketState.current.emit('chatLeave', {
          userCode,
          projectCode,
        });
        if (!isDetailPage) {
          socketState.current.close();
        }
        // if (isClose) {
        //   console.log('project socket close');
        //   socketState.current.close();
        // }
      }
      // console.log('setChatData work');
    },
    [socketState.current, userCode, projectCode, isDetailPage],
  );

  const handleJoinProject = useCallback(
    () => {
      console.log('handleJoinProject');
      // NOTE: project 들어올경우 권한없을 시 403이 발생하기때문에 valid check 불필요
      // const { isApply = false } = data;
      // // const { isApply = false, userCode, projectCode, senderCode, company } = data;
      // // const isValidJoinDesigner = !!attendDesignerList?.find(
      // //   item => item.designerCode === userCode,
      // // );
      // // apply일 경우 기존 attendList 확인 안함
      // // apply아닐경우 designer 경우 apply 한 유저인지 확인 (그냥 입장시 채팅방 연결 유무 확인)
      // let isValidJoinDesigner = false;
      // if (isApply) {
      //   isValidJoinDesigner = true;
      // } else {
      //   isValidJoinDesigner =
      //     !!attendDesignerList?.find(item => item.designerCode === userCode) ||
      //     receiverCode === userCode;
      // }
      // // client인지 확인
      // const isValidJoinClient = senderCode === userCode;
      // let validSubmitList = [isValidJoinClient, isValidJoinDesigner];
      // console.log('validSubmitList', validSubmitList);
      // const isValidSubmitValue = validSubmitList.some(item => !!item);
      // if (!isValidSubmitValue) return console.log('isValidSubmitValue', isValidSubmitValue);

      const joinData = {
        userCode,
        projectCode,
        senderCode,
        company,
        userType,
        isRefresh: isRefresh.value,
      };
      if (!!socketState.current) {
        console.log('socket emit projectJoin', joinData);
        socketState.current.emit('projectJoin', joinData);
      }
      // isCancelApply.setValue(false);
      isRefresh.setValue(false);
    },
    [socketState.current, projectInfo, user, isRefresh.value],
    // [socketState, projectInfo, user, isRefresh.value, attendDesignerList],
  );

  // project detail 들어온 이후 소켓연결 확인, projectInfo 데이터 확인 이후 Join, Join에서 valid 실행
  // TODO: projectData로 변경, success로 하게될 경우 projectUpdate 이후 refetch의 경우 다시 join됨
  // TODO: attendUser정보 데이터 가지고 오는 곳 백엔드 수정 요청, 기존과 attendDesignerLIst가 변경됨
  // useDidUpdateEffect(() => {
  //   if (isConnect && !!projectInfo) {
  //     console.log('isConnect', isConnect);
  //     // console.log('isFetchSuccess', isFetchSuccess);
  //     // console.log('call projectJoin');
  //     // handleJoinProject();
  //   }
  // }, [isConnect, !!projectInfo]);

  // TEST:
  useEffect(() => {
    console.log('chatUserData', chatUserData);
    // console.log('isFetchSuccess', isFetchSuccess);
    // console.log('isCancelApply', isCancelApply.value);
    // }, [isFetchSuccess, isCancelApply.value]);
  }, [chatUserData]);

  return (
    <ProjectSocketContext.Provider
      value={{
        projectCode,
        projectStatus,
        isConnect,
        socketState,
        isCancelApply,
        isRefresh,
        chatUserData,
        // enterDesignerData,
        // leaveDesignerData,
        updateProjectData,
        applyDesignerData,
        chatResponseStatus,
        chatListData,
        chatListRequestPossible,
        lastUnreadMessageId,
        chatListAllItems,
        chatData,
        participant,
        participantCount,
        handleLeaveChat,
        handleJoinProject,
      }}
    >
      {children}
    </ProjectSocketContext.Provider>
  );
}
