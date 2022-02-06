import { Grid, TextField } from '@material-ui/core';
import cx from 'classnames';
import { icon_send, icon_speach_bubble, logo } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import T from 'components/common/text/T';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import useInput from 'lib/hooks/useInput';
import useKeyboard from 'lib/hooks/useKeyboard';
import { cutUrl } from 'lib/library';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { color, paper } from 'styles/utils';

// http://localhost:48052/private, http://localhost:48052/project
export default function ProjectChatContainer({}) {
  const { user, attendDesignerList } = useShallowSelector(state => ({
    user: state.user.user,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
  }));
  const { pcode } = useParams();
  const { pathname, search } = useLocation();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  // const queryParse = queryString.parse(search);
  // const projectCode = queryParse?.projectCode;
  const projectCode = pcode;

  const talkBoxListRef = useRef();
  const message = useInput('');
  const page = useInput(1);
  const userCode = user?.userCode;

  // const chatLogs = useInput([]);
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    socketState,
    isRefresh,
    chatUserData,
    chatListAllItems,
    chatListData,
    chatData,
    handleLeaveChat,
  } = useContext(ProjectSocketContext);
  // const chatUserData = {};
  // const chatResponse = [];

  useEffect(() => {
    // console.log('chatListAllItems, ____', chatListAllItems);
    // console.log('chatListData, ____', chatListData);
    console.log('chatData, ____', chatData);
  }, [chatListAllItems, chatListData, chatData]);

  // TEST:
  // useEffect(() => {
  //   console.log('isRefresh.value', isRefresh.value);
  // }, [isRefresh.value]);
  // useEffect(() => {
  //   console.log('chatUserData', chatUserData);
  // }, [chatUserData]);
  // useEffect(() => {

  // 새로고침 되기전에 또는 채팅페이지 나갔을 경우 chat leave
  // const refreshChat = () => {
  //   // // 표준에 따라 기본 동작 방지
  //   // event.preventDefault();
  //   // // Chrome에서는 returnValue 설정이 필요함
  //   // event.returnValue = '';
  //   console.log('refresh leaveChat');
  //   handleLeaveChat();
  //   isRefresh.setValue(true);
  // };
  // useEffect(() => {
  //   // window.addEventListener('beforeunload', refreshChat);
  //   return () => {
  //     console.log('call leaveChat');
  //     // window.removeEventListener('beforeunload', refreshChat);
  //     handleLeaveChat();
  //   };
  // }, []);

  // apply, cancel apply 시점에서 잡아줌
  // SECTION: init request
  // useEffect(() => {
  //   return () => {
  //     // leave chat
  //     console.log('leaveChat');
  //     handleLeaveChat();
  //   };
  // }, []);

  // chatRoomId 연결
  let submitChatListData = useMemo(() => {
    return {
      chatRoomId: chatUserData?.result?._id,
      page: page.value,
    };
  }, [chatUserData, page.value]);
  // 페이지 첫 로딩시, chatUserData받은 후 기존 채팅 page 1 로딩
  // useEffect(() => {
  useDidUpdateEffect(() => {
    console.log('chatUserData?.result?._id', chatUserData?.result?._id);
    if (!!chatUserData?.result?._id) {
      socketState.current.emit('chatList', submitChatListData);
      console.log('emit chatList');
    }
  }, [chatUserData?.result?._id]);
  // useEffect(() => {
  //   console.log('chatUserData?.result?._id', chatUserData?.result?._id);
  //   if (!!chatUserData?.result?._id) {
  //     console.log('emit chatList');
  //     socketState.current.emit('chatList', submitChatListData);
  //   }
  // }, [chatUserData?.result?._id]);

  const handleSendMessage = () => {
    // console.log('message.value', message.value);
    // console.log('message.value', !message.value);
    console.log('handleSendMessage');
    if (!message.value?.trim()) return;

    const sendData = {
      userCode,
      chatRoomId: chatUserData?.result?._id,
      message: message.value,
      projectCode: chatUserData?.result?.projectCode,
    };
    // "chatRoomId" : "602b71de5b6a0aa91cd57fbb",
    // "message"  : "안녕하세요?",
    // "userCode" : "J720AUG-0001",
    // "projectCode" : "20201210-d3c26fe5-87c4-402d-989f-e83f7b80cf42"
    // request api
    // socketState.current.emit('projectJoin', {projectCode,userCode, senderCode});
    console.log('sendData', sendData);
    socketState.current.emit('chatSend', sendData);
    // 요청 이후
    message.setValue('');
  };

  // 채팅 res에 따른 스크롤 높이 조절
  useDidUpdateEffect(() => {
    if (talkBoxListRef.current && chatData.length > 0) {
      // console.log('scrollTop work?');
      talkBoxListRef.current.scrollTop = talkBoxListRef.current.scrollHeight;
    }
  }, [!!talkBoxListRef.current, chatData]);
  useDidUpdateEffect(() => {
    if (talkBoxListRef.current && chatListAllItems.length > 0) {
      if (chatListAllItems.length <= 10) {
        // console.log('scrollTop work 2?');
        talkBoxListRef.current.scrollTop = talkBoxListRef.current.scrollHeight;
      } else {
        // console.log('scrollTop work 3?');
        talkBoxListRef.current.scrollTop = talkBoxListRef.current.scrollHeight - scrollHeight;
      }
    }
  }, [!!talkBoxListRef.current, chatListAllItems]);

  // sonScroll
  const handleScrollChat = e => {
    const target = e.currentTarget;
    if (target.scrollTop === 0) {
      const nextPage = page.value + 1;
      // console.log('nextPage', nextPage);
      submitChatListData = {
        ...submitChatListData,
        page: nextPage,
      };
      // console.log('submitChatListData', submitChatListData);
      // if (chatListData.hasNextPage) socketState.current.emit('chatList', submitChatListData);
      if (nextPage <= chatListData?.pagingData?.totalPage)
        socketState.current.emit('chatList', submitChatListData);
      page.setValue(nextPage);
      setScrollHeight(target.scrollHeight);
    }
  };
  // console.log('chatListData', chatListData);

  return (
    <ProjectChat
      talkBoxListRef={talkBoxListRef}
      message={message}
      onScrollChat={handleScrollChat}
      onSendMessage={handleSendMessage}
    />
  );
}

export const ProjectChat = React.memo(function ProjectChat({
  talkBoxListRef,
  message,
  onScrollChat,
  onSendMessage,
}) {
  const { userCode } = useShallowSelector(state => ({
    userCode: state.user.user?.userCode,
    // projectInfo: state.project.data?.projectInfo
  }));
  const keyboard = useKeyboard();
  const { t } = useTranslation();
  const {
    isConnect,
    chatResponseStatus,
    chatListAllItems,
    chatListData,
    chatData,
    participant = {},
    participantCount,
  } = useContext(ProjectSocketContext);
  // 참여자 2인 이상 체크
  // TODO: 변경 예정: participantCount
  // const isPossibleChat = _.size(participant) > 1;
  const isPossibleChat = !!participantCount;

  // useEffect(() => {
  //   console.log('participant', participant);
  //   console.log('isPossibleChat', isPossibleChat);
  // }, [participant, isPossibleChat]);

  // useEffect(() => {
  //   console.log('isConnect-', isConnect);
  // }, [isConnect]);

  return (
    <Styled.ProjectChat data-component-name="ProjectChat" className="projectChat">
      {isConnect === false && (
        <div className="projectChat__talk_box_dim">
          <T>MODAL_RECONNECT</T>
        </div>
      )}

      <Grid container alignItems="center" className="projectChat__title_container">
        <Grid item xs={2}>
          <img src={icon_speach_bubble} alt="speach bubble" />
          <CustomSpan fontSize={11}>
            <T>GLOBAL_TOTAL</T>: {participantCount}
          </CustomSpan>
        </Grid>

        <Grid item xs={10}>
          <CustomText fontSize={13} style={{ lineHeight: 1.5 }}>
            <T>CHAT_DESCRIPTION</T>
          </CustomText>
        </Grid>
      </Grid>

      <div className="projectChat__content_container">
        <div className="projectChat__talk_box_list" ref={talkBoxListRef} onScroll={onScrollChat}>
          {chatListAllItems?.length > 0 &&
            chatListAllItems.map((item, index) => {
              const isSelf = userCode === item.sender;
              return (
                <div
                  key={index}
                  className={cx('projectChat__talk_box', {
                    self: isSelf,
                    partner: !isSelf,
                  })}
                >
                  <div className="projectChat__talk_date">
                    <span className="projectChat__talk_time">
                      {moment(item.sendDate).format('YYYY-MM-DD HH:mm')}
                    </span>
                    {!isSelf && (
                      <span className="projectChat__talk_name">
                        {_.find(participant, i => i.userCode === item.sender)?.company}
                      </span>
                    )}
                  </div>
                  <div className="projectChat__talk_content">
                    {item.message}
                    {/* <EscapeConvert content={item.message} /> */}
                  </div>
                </div>
              );
            })}
          {chatData?.length > 0 &&
            chatData.map((item, index) => {
              const isSelf = userCode === item.sender;
              // console.log('userCode', userCode);
              // console.log('item.sender', item.sender);
              // console.log(isSelf, 'isSelf');
              // console.log('item.company', item.company);
              if (item.eventType === 'enter' && !isSelf) {
                return (
                  <p className="projectChat__talk_new_user" key={index}>
                    {t('CHAT_ENTERED', { user: item.company })}
                    {/* {item.company} 님이 입장하셨습니다. */}
                  </p>
                );
              }
              if (item.eventType === 'leave' && !isSelf) {
                return (
                  <p className="projectChat__talk_new_user" key={index}>
                    {/* {_.find(participant, i => i.userCode === item.sender)?.company} 님이
                    퇴장하셨습니다. */}
                    {t('CHAT_LEAVE', {
                      user: _.find(participant, i => i.userCode === item.sender)?.company,
                    })}
                  </p>
                );
              }
              if (item.eventType === 'message') {
                return (
                  <div
                    key={index}
                    className={cx('projectChat__talk_box', {
                      self: isSelf,
                      partner: !isSelf,
                    })}
                  >
                    <div className="projectChat__talk_date">
                      <span className="projectChat__talk_time">
                        {moment(item.sendDate).format('YYYY-MM-DD HH:mm')}
                      </span>
                      {!isSelf && (
                        <span className="projectChat__talk_name">
                          {_.find(participant, i => i.userCode === item.sender)?.company}
                        </span>
                      )}
                    </div>
                    <div className="projectChat__talk_content">
                      <EscapeConvert content={item.message || ''} />
                    </div>
                  </div>
                );
              }
            })}
          {/* <div
            className={cx('projectChat__talk_box', {
              client: true,
            })}
          >
            <div className="projectChat__talk_date">
              <span className="projectChat__talk_time">{moment().format('YYYY-MM-DD HH:mm')}</span>
            </div>
            <div className="projectChat__talk_content">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. In blanditiis, et autem
              deleniti dolore suscipit quaerat recusandae repudiandae numquam saepe tenetur, omnis
              beatae molestias eum excepturi praesentium, adipisci velit quos?
            </div>
          </div>
          <div
            className={cx('projectChat__talk_box', {
              designer: true,
            })}
          >
            <div className="projectChat__talk_date">
              <span className="projectChat__talk_time">{moment().format('YYYY-MM-DD HH:mm')}</span>
              <span className="projectChat__talk_name"> Name</span>
            </div>
            <div className="projectChat__talk_content">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. In blanditiis, et autem
              deleniti dolore suscipit quaerat recusandae repudiandae numquam saepe tenetur, omnis
              beatae molestias eum excepturi praesentium, adipisci velit quos?
            </div>
          </div> */}
        </div>

        <div className="projectChat__input_box_outer">
          <div className="projectChat__input_box">
            <MuiWrapper className="projectChat__input">
              <TextField
                variant="outlined"
                fullWidth
                multiline
                // value={isPossibleChat ? message.value : '참여한 유저가 없습니다.'}
                value={isPossibleChat ? message.value : t('CHAT_NO_PARTICIPATED')}
                disabled={chatResponseStatus === 500 || !isPossibleChat}
                onKeyDown={e => {
                  // 기본 ENTER 줄바꿈 막기, SHIFT와 같이 있을 경우에만 줄바꿈 적용
                  if (!keyboard.value.has('SHIFT') && e.key.toUpperCase() === 'ENTER')
                    e.preventDefault();
                  keyboard.onChange({ key: e.key, type: 'keydown' });
                }}
                onKeyUp={e => {
                  // console.log('e.target.value', e.target.value);
                  // if (!keyboard.value.has('SHIFT') && keyboard.value.has('ENTER')) onSendMessage();
                  // value있고 SHIFT안 누르고 ENTER만 눌렀을 경우 submit
                  if (
                    !!e.target.value &&
                    !keyboard.value.has('SHIFT') &&
                    keyboard.value.has('ENTER')
                  )
                    onSendMessage();
                  keyboard.onChange({ key: e.key, type: 'keyup' });
                }}
                onChange={message.onChange}
              />
            </MuiWrapper>
            <MuiButton
              disableElevation
              variant="contained"
              color="primary"
              className="projectChat__send_btn"
              disabled={chatResponseStatus === 500 || !isPossibleChat || !message.value?.trim()}
              onClick={() => {
                onSendMessage();
              }}
            >
              {/* <ArrowUpwardIcon htmlColor="#fff" /> */}
              <img src={icon_send} alt="send" />
            </MuiButton>
          </div>
        </div>
      </div>
    </Styled.ProjectChat>
  );
});

const Styled = {
  ProjectChat: styled.div`
    position: relative;
    .projectChat__talk_box_dim {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      font-size: 14px;
      color: #fff;
      line-height: 1.3;
      text-align: center;
    }
    .projectChat__title_container {
      margin-bottom: -20px;
      height: 90px;
      padding: 0 12px;
      padding-bottom: 20px;
      background: #0782ed;
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      color: white;
      > {
        &:first-child {
          border-right: 1px solid rgba(255, 255, 255, 0.5);
        }
        &:nth-child(2) {
          padding-left: 15px;
        }
      }
    }
    .projectChat__content_container {
      position: relative;
      /* height: 370px; */
      padding: 12px;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
    }
    .projectChat__talk_box_list {
      padding: 10px 5px;
      height: 538px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .projectChat__talk_new_user {
      margin-top: 12px;
      text-align: center;
      font-size: 12px;
      & + .projectChat__talk_new_user {
        margin-top: 5px;
      }
    }
    .projectChat__talk_box {
      position: relative;
      border-radius: 2px;
      font-size: 14px;
      &:not(:first-child) {
        margin-top: 10px;
      }
      .projectChat__talk_time,
      .projectChat__talk_name {
        display: inline-block;
        vertical-align: bottom;
        letter-spacing: -0.3px;
      }
      .projectChat__talk_time {
        font-size: 10px;
      }
      .projectChat__talk_content {
        position: relative;
        margin-top: 5px;
        padding: 10px;
        line-height: 1.3;
        &:after {
          position: absolute;
          content: '';
          top: 10px;
          border: 10px solid transparent;
          border-top-width: 7px;
          border-bottom-width: 7px;
        }
      }
      &.self {
        margin-right: 10px;
        .projectChat__talk_date {
          text-align: left;
        }
        .projectChat__talk_content {
          background-color: #dbf0ff;
          &:after {
            border-left-color: #dbf0ff;
            right: -20px;
          }
        }
      }
      &.partner {
        margin-left: 10px;
        .projectChat__talk_date {
          text-align: right;

          .projectChat__talk_name {
            margin-left: 5px;
            max-width: 130px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .projectChat__talk_content {
          position: relative;
          background-color: #eeeeee;
          &:after {
            border-right-color: #eee;
            left: -20px;
          }
        }
      }
    }
    .projectChat__input_box_outer {
      /* position: absolute;
      height: 108px;
      left: 0;
      bottom: 0; */
      position: relative;
      width: 100%;
      .projectChat__input_box {
        display: flex;
        align-items: middle;
        justify-content: space-between;
        /* height: 108px;
        padding: 20px; */
        height: 68px;
        background-color: #fff;
        .muiWrapper {
          width: 80%;
          height: 100%;
          .MuiInputBase-root {
            padding: 10px;
          }
          textarea {
            padding: 0;
            height: 100% !important;
            overflow-y: auto !important;
          }
        }
        .button {
          width: calc(20% - 5px);
          height: 100%;
          min-width: initial;
        }
      }
    }
  `,
};
