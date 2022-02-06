import useInput from 'lib/hooks/useInput';
import { cutUrl } from 'lib/library';
import { notificationsModalEventType } from 'lib/mapper';
import { BASE_SOCKET_PRIVATE_URL } from 'lib/setting';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import store from 'store';
import { AppActions, EventActions } from 'store/actionCreators';
import { isLogInSelector } from 'store/modules/auth';

export const PrivateSocketContext = createContext();

export function PrivateSocketProvider({ value, children }) {
  const { user, isLogin, signUpSuccess, signUpFailure, signOutSuccess, projectData } =
    useShallowSelector(state => ({
      user: state.user.user,
      isLogin: isLogInSelector(state),
      signUpSuccess: state.auth.signUp.success,
      signUpFailure: state.auth.signUp.failure,
      signOutSuccess: state.auth.signOut.success,
      projectData: state.project.project.data,
    }));
  const { pathname } = useLocation();
  const isProjectPage = `${cutUrl(pathname)}` === 'project';
  const isAuthPage = `${cutUrl(pathname)}` === 'auth';
  const userCode = user?.userCode;
  const projectSenderCode = projectData?.projectInfo?.senderCode;
  const { t } = useTranslation();
  // socket state
  // const [socketState, setSocketState] = useState(null);
  const socketState = useRef(null);
  // 초기값 null, connect: true, disconnect: false, socket.open() 용도
  // const [isConnect, setIsConnect] = useState(null);
  // const [isOpenSocket, setIsOpenSocket] = useState(null);
  // change new Events 변경 알림 -> NotificationContainer 에서 받아서 reFetch
  const isChangeNewEvents = useInput(null);
  const [realTimeChat, setRealTimeChat] = useState(null);
  const [realTimeEvent, setRealTimeEvent] = useState(null);

  // TEST:
  // useEffect(() => {
  //   console.log('isProjectClient', isProjectClient);
  // }, [isProjectClient]);

  // TODO: 차후 개발 로그아웃
  // const handleBreakAuth = useCallback(() => {
  // console.log(' chatLeave ', socket.id);
  // console.log('projectCode');
  // if (!userCode) {
  //   return AppActions.show_toast({ type: 'error', message: 'Bad Request 400' });
  // }
  // socket.emit('authBreak', {
  //   userCode,
  // });
  // }, [socket]);

  // init, accessToken(로그인, 아웃 기점 실행)
  useEffect(() => {
    if (isLogin) {
      // console.log('private socket open');
      // console.log('accessToken', accessToken);
      const socket = io(BASE_SOCKET_PRIVATE_URL, {
        path: '/notification/socket.io',
        reconnectionDelayMax: 10000,
        autoConnect: false,
        auth: { 'x-access-token': store.getState().auth.accessToken },
      });
      socket.open();
      socketState.current = socket;
      // setIsOpenSocket(true);

      socket.on('connect', () => {
        console.log('private socket connect_', socket.id, socket.connected);
        // socket.open();
        // emit auth
        handleEmitAuth();
      });

      socket.on('disconnect', () => {
        console.log('private socket connect_dis', socket.connected);
        // console.log('socket.id', socket.id);
        // socket.open();
      });

      socket.on('connect_error', error => {
        console.log('private socket connect_error', error);
        socket.close();
      });

      // private socket 실행시 fetch new events
      EventActions.fetch_new_events_request();

      /**
       * 1: *프로젝트 초대 - 클라이언트 invite action, stage: 0
       * 2: *프로젝트 지원 - 디자이너 apply action, stage: 1
       * 3: 디자이너를 변경 - 클라이언트 changeDesigner action, stage: 0
       * 4: 디자이너가 포기 - 디자이너 giveup action, stage: 0
       * 5: *디자이너 작업물 제출 - 디자이너 done action, stage: 3
       * 6: *클라이언트 프로젝트 완료 - 클라이언트 confirm & pay action, stage: 4
       * 7: *클라이언트가 수정 요청 - 클라이언트 Remake request action, stage: 2
       * 8: *프로젝트 디자이너 선택 메시지 - 클라이언트 select action, stage: 0
       * 10: 프로젝트 디자이너 선택 수락 - 디자이너 accept action, stage: 1
       * 11: *프로젝트 작업 시작 - 디자이너 working action, stage: 2
       * 9: *프로젝트 디자이너 거절 - 디자이너 reject action, stage: 0
       * 15: *프로젝트 지원취소 - 디자이너 cancel apply, stage: 0
       *  - 디자이너가 Reject클릭 -> Create Stage, 해당 Client의 화면 (Rock, 검은 배경, 팝업또는 메시지)
       * doc/eventType.json 참고
       */

      const validAlertEventTypeIdxList = [1, 2, 5, 6, 7, 8, 9, 11, 15];
      const convertEventMessage = ({ eventType, eventTitle, params }) => {
        // 1, 6, 7, 8 - clientByProject
        // 2, 5, 11 - designerByProject
        switch (eventType) {
          case 'PROJECT_CREATE':
            return {
              eventType: notificationsModalEventType.client,
              message: eventTitle?.PROJECT_CREATE,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'PROJECT_UPDATE':
            return {
              eventType: notificationsModalEventType.designer,
              message: eventTitle?.PROJECT_UPDATE,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'PROJECT_REVIEW':
            return {
              eventType: notificationsModalEventType.client,
              message: eventTitle?.PROJECT_REVIEW,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'PROJECT_REVIEW_COMPLETE':
            return {
              eventType: notificationsModalEventType.client,
              message: eventTitle?.PROJECT_REVIEW_COMPLETE,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'DESIGNER_WORKING':
            return {
              eventType: notificationsModalEventType.designer,
              message: eventTitle?.DESIGNER_WORKING,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'DESIGNER_WORK_DONE':
            return {
              eventType: notificationsModalEventType.designer,
              message: eventTitle?.DESIGNER_WORK_DONE,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'CLIENT_CONFIRM':
            return {
              eventType: notificationsModalEventType.client,
              message: eventTitle?.CLIENT_CONFIRM,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          case 'CLIENT_REMAKE_REQ':
            return {
              eventType: notificationsModalEventType.client,
              message: eventTitle?.CLIENT_REMAKE_REQ,
              // message: t('POPUP_MSG_PROJECT_INVITATION'),
              // okText: t('POPUP_BTN_ACCEPT_INVITATION'),
            };
          default:
            return {
              eventType: '',
              message: '',
              okText: '',
            };
          // AppActions.show_toast({ type: 'error', message: `Unhandled eventTypeIdx: ${id}` });
          // throw new Error(`Unhandled eventTypeIdx: ${eventTypeIdx}`);
        }
      };

      // 새로운 notifications 왔을 경우 fetch new events
      socket.on('notification', data => {
        console.log('socket notification', data);
        const { eventType, eventTitle, params, userCode } = data;

        AppActions.show_toast({
          eventType,
          params,
          delay: 5000,
          // isAutoRemove: false,
          ...convertEventMessage({ eventType, eventTitle, params }),
          message: t(`NOTIFICATION_EVENT_TITLE_${eventType}`),
        });

        // request api
        EventActions.fetch_new_events_request();
        isChangeNewEvents.setValue(true);
      });

      socket.on('realTimeChat', data => {
        console.log('socket realTimeChat', data);
        // { projectCode: }
        setRealTimeChat(data);
      });

      // TODO: remake, done시 해당하는 유저에게 표시
      socket.on('realTimeEvent', data => {
        console.log('socket realTimeEvent', data);
        // { projectCode: }
        setRealTimeEvent(data);
      });
    }
  }, [isLogin]);

  // signOut 발생시 socket close
  useDidUpdateEffect(() => {
    if (!!socketState.current && !user) {
      console.log('private socket close');
      socketState.current.close();
      // setIsConnect(null);
    }
  }, [socketState.current, user]);

  // disconnect이후 재연결
  // useDidUpdateEffect(() => {
  //   if (!!socketState && !!accessToken && isConnect === false) {
  //     console.log('private socket re open');
  //     // socketState.current.open();
  //   }
  // }, [socketState, accessToken, isConnect]);

  const handleEmitAuth = () => {
    if (!userCode)
      return AppActions.show_toast({
        type: 'error',
        message: 'Private Socket Auth\n Bad Request 400',
      });
    console.log('private auth', userCode);
    socketState.current.emit('auth', { userCode });
  };

  const handleListenNotification = socket => {
    // 새로운 notifications 왔을 경우 fetch new events
    socket.on('notification', data => {
      // console.log('socket notification', data);
      // request api
      EventActions.fetch_new_events_request();
      isChangeNewEvents.setValue(true);
    });
  };

  return (
    <PrivateSocketContext.Provider value={{ isChangeNewEvents, realTimeChat, realTimeEvent }}>
      {children}
    </PrivateSocketContext.Provider>
  );
}

// export const useAppContextValue = () => {
//   const value = useContext(AppContext);
//   return value;
// };
