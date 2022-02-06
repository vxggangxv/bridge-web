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
import _, { debounce, throttle } from 'lodash';
import moment from 'moment';
import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { color, paper } from 'styles/utils';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { ENV_MODE_DEV } from 'lib/setting';
import axios from 'axios';
import { fetch_google_translate } from 'store/modules/util';
import { UtilActions } from 'store/actionCreators';
import { axs } from 'api/config/axiosConfig';
import { fetchGoogleTranslate } from 'api/util';

// http://localhost:48052/private, http://localhost:48052/project
export default function ProjectChatContainer({ isShowChat }) {
  const { user, attendDesignerList, language } = useShallowSelector(state => ({
    user: state.user.user,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
    language: state.base.language,
  }));
  const { pcode } = useParams();
  const { pathname, search } = useLocation();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  // const queryParse = queryString.parse(search);
  // const projectCode = queryParse?.projectCode;
  const projectCode = pcode;

  const talkBoxListScrollRef = useRef();
  const message = useInput('');
  const page = useInput(1);
  const userCode = user?.userCode;
  const [transMessageList, setTransMessageList] = useState([]);
  const [prevLanguage, setPrevLanguage] = useState(language);
  // const API_KEY = [YOUR_API_KEY];
  // let text = 'something to translate';
  // let toLang = 'en';

  // let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  // url += '&q=' + encodeURI(text);
  // url += `&target=${toLang}`;

  // TODO: translation
  const translationGoogle = async text => {
    console.log('translationGoogle call');
    try {
      const { data } = await fetchGoogleTranslate({
        text,
        target: language.toLowerCase(),
      });

      console.log('data?.translateInfo?.translation', data?.translateInfo?.translation);
      return data?.translateInfo?.translation || null;
    } catch (error) {
      console.log('translationGoogle error', error);
    }
    //   "translateInfo": {
    //     "target": "ko",
    //     "text": "My name is <span translate=\"no\">Crown</span>",
    //     "translation": "내 이름은 <span translate=\"no\">Crown</span>"
    // }
    // const translationUrl = `https://translation.googleapis.com/language/translate/v2`;
    // const translationData = {
    //   key: process.env.REACT_APP_GOOGLE_TRANSLATION_KEY,
    //   // q: encodeURI(message),
    //   // target: language,
    //   q: message,
    //   target: language.toLowerCase(),
    // };

    // try {
    //   const result = await axs({
    //     url: translationUrl,
    //     method: 'get',
    //     params: translationData,
    //   });
    //   console.log('result', result);
    //   return result?.data?.translations[0].translatedText;
    // } catch (error) {
    //   console.log('error', error);
    //   return null;
    // }
    // {
    //   "data": {
    //     "translations": [{
    //       "translatedText": "La Gran Pirámide de Giza (también conocida como la Pirámide de Khufu o la Pirámide de Keops) es la más antigua y más grande de las tres pirámides en el complejo de la pirámide de Giza."
    //     }]
    //   }
    // }
  };

  const handleTranslation = async data => {
    const { id, message } = data;

    const currentTransItem = transMessageList.find(item => item.id === id);

    // NOTE: 변경 안될 단어 등록 후
    // 언어 동일한 조건하에서 translate call 한 후에는 변경된 텍스트로 노출, 같은 내용을 다시 call을 하지 않도록
    // 언어가 변경됐을 경우 다시 translate call 하도록
    // e.g. <span translate="no">Crown</span>
    let transMessage = '';
    // 설정한 언어가 변경되었을 경우 새롭게 call
    const isChangeLanguage =
      currentTransItem?.language &&
      (prevLanguage !== currentTransItem?.language || prevLanguage !== language);
    if (isChangeLanguage) {
      transMessage = await translationGoogle(message);
      setPrevLanguage(language);
    } else {
      // 처음 생성시 경로
      transMessage = currentTransItem?.transMessage || (await translationGoogle(message));
    }

    setTransMessageList(draft => {
      const currentItem = draft.find(item => item.id === id);
      // console.log('currentItem', currentItem);
      if (currentItem) {
        return draft.map(item => {
          if (item.id === id) {
            item.active = !item.active;
            if (isChangeLanguage) {
              item.transMessage = transMessage;
              item.language = language;
            }
          }
          return item;
        });
      }

      // TODO: request api
      // const result = await
      const obj = {
        id,
        message,
        transMessage,
        language,
        active: true,
      };

      return draft.concat(obj);
    });
  };

  // TEST:
  useEffect(() => {
    console.log('transMessageList', transMessageList);
  }, [transMessageList]);

  // const chatLogs = useInput([]);
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    socketState,
    isRefresh,
    chatUserData,
    // chatListAllItems,
    chatListData,
    chatData,
    handleLeaveChat,
    chatListRequestPossible,
    participantCount,
  } = useContext(ProjectSocketContext);
  // const chatUserData = {};
  // const chatResponse = [];

  const chatMessageList = useMemo(() => {
    return chatData.filter(item => !!item.message);
  }, [chatData]);

  // TEST:
  // useEffect(() => {
  //   console.log('chatMessageList', chatMessageList);
  // }, [chatMessageList]);

  useEffect(() => {
    // console.log('chatListAllItems, ____', chatListAllItems);
    // console.log('chatListData, ____', chatListData);
    console.log('chatData, ____', chatData);
  }, [chatListData, chatData]);

  // chatRoomId 연결
  let submitChatListData = useMemo(() => {
    return {
      chatRoomId: chatUserData?.result?._id,
      page: page.value,
      skip: chatMessageList?.length || 0,
    };
  }, [chatUserData, page.value, chatMessageList]);
  // 페이지 첫 로딩시, chatUserData받은 후 기존 채팅 page 1 로딩
  useDidUpdateEffect(() => {
    console.log('chatUserData?.result?._id', chatUserData?.result?._id);
    if (!!chatUserData?.result?._id) {
      // console.log('first submitChatListData', submitChatListData);
      socketState.current.emit('chatList', submitChatListData);
      console.log('emit chatList');
    }
  }, [chatUserData?.result?._id]);

  const handleSendMessage = () => {
    // console.log('message.value', message.value);
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
    if (talkBoxListScrollRef?.current?.scrollTop) talkBoxListScrollRef.current.scrollTop = 0;
  };

  // 채팅 res에 따른 스크롤 높이 조절
  // useDidUpdateEffect(() => {
  //   if (talkBoxListScrollRef.current && chatData.length > 0) {
  //     // console.log('scrollTop work?');
  //     talkBoxListScrollRef.current.scrollTop = talkBoxListScrollRef.current.scrollHeight;
  //   }
  // }, [!!talkBoxListScrollRef.current, chatData]);
  // useDidUpdateEffect(() => {
  //   if (talkBoxListScrollRef.current && chatListAllItems.length > 0) {
  //     if (chatListAllItems.length <= 10) {
  //       // console.log('scrollTop work 2?');
  //       talkBoxListScrollRef.current.scrollTop = talkBoxListScrollRef.current.scrollHeight;
  //     } else {
  //       // console.log('scrollTop work 3?');
  //       talkBoxListScrollRef.current.scrollTop = talkBoxListScrollRef.current.scrollHeight - scrollHeight;
  //     }
  //   }
  // }, [!!talkBoxListScrollRef.current, chatListAllItems]);

  // TODO: date 변경시 표시 메시지

  // onScroll
  const handleScrollChat = e => {
    const chatListHeight = 530;
    const target = e.currentTarget;
    // const listFullHeight = chatListHeight + target.scrollHeight;
    if (!target?.scrollTop) return;

    console.log('target.scrollTop', target.scrollTop);
    const targetScrollTop = Math.abs(target.scrollTop);
    // const targetScrollTop = target.scrollTop;
    const requestOffset = (target.scrollHeight - chatListHeight) * 0.8;
    // console.log('targetScrollTop', targetScrollTop);
    // console.log('requestOffset', requestOffset);
    // console.log('targetScrollTop > requestOffset', targetScrollTop > requestOffset);
    if (targetScrollTop > requestOffset && chatListRequestPossible.value) {
      const nextPage = page.value + 1;
      // console.log('nextPage', nextPage);
      submitChatListData = {
        ...submitChatListData,
        page: nextPage,
      };
      console.log('submitChatListData', submitChatListData);
      chatListRequestPossible.setValue(false);
      // if (chatListData.hasNextPage) socketState.current.emit('chatList', submitChatListData);
      if (chatListData?.hasNext) {
        // if (nextPage <= chatListData?.pagingData?.totalPage) {
        console.log('not first submitChatListData', submitChatListData);
        socketState.current.emit('chatList', submitChatListData);
        page.setValue(nextPage);
        // setScrollHeight(target.scrollHeight);
      }
    }
  };
  // console.log('chatListData', chatListData);

  // page 1일 경우, 안읽은 메시지 많을 경우 스크롤 탑 이동
  useDidUpdateEffect(() => {
    if (
      chatListData.page === 1 &&
      chatData?.length > chatListData?.defaultChatCount + participantCount
    ) {
      talkBoxListScrollRef.current.scrollTop = -talkBoxListScrollRef.current.scrollHeight;
    }
  }, [chatListData.page, chatData]);

  return (
    <ProjectChat
      talkBoxListScrollRef={talkBoxListScrollRef}
      message={message}
      transMessageList={transMessageList}
      onScrollChat={handleScrollChat}
      onSendMessage={handleSendMessage}
      onTranslation={handleTranslation}
    />
  );
}

export const ProjectChat = React.memo(function ProjectChat({
  talkBoxListScrollRef,
  message,
  transMessageList,
  onScrollChat,
  onSendMessage,
  onTranslation,
}) {
  const { userCode, projectInfo } = useShallowSelector(state => ({
    userCode: state.user.user?.userCode,
    projectInfo: state.project.project.data?.projectInfo,
  }));
  const keyboard = useKeyboard();
  const { t } = useTranslation();

  const {
    isConnect,
    chatResponseStatus,
    // chatListAllItems,
    lastUnreadMessageId,
    chatData,
    participant = {},
    participantCount,
  } = useContext(ProjectSocketContext);
  // 참여자 2인 이상 체크
  // TODO: 변경 예정: participantCount
  // const isPossibleChat = _.size(participant) > 1;
  const isPossibleChat = ENV_MODE_DEV ? !!participantCount : participantCount > 1;

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
          {ENV_MODE_DEV && (
            <>
              <br />
              <CustomSpan fontSize={11}>
                <T>GLOBAL_TOTAL</T>: {participantCount ? participantCount : 1}
              </CustomSpan>
            </>
          )}
        </Grid>

        <Grid item xs={10}>
          <CustomText fontSize={13} style={{ lineHeight: 1.5 }}>
            <T>CHAT_DESCRIPTION</T>
          </CustomText>
        </Grid>
      </Grid>

      <div className="projectChat__content_container">
        <div
          ref={talkBoxListScrollRef}
          onScroll={onScrollChat}
          className="projectChat__talk_box_list"
        >
          {chatData?.length > 0 &&
            chatData.map((item, index) => {
              const isSelf = userCode === item.sender;
              const prevItem = index > 0 && chatData[index - 1];
              const prevDate = moment(prevItem?.sendDate || null).date();
              const currentDate = moment(item?.sendDate || null).date();
              const isSender = item.sender === projectInfo?.senderCode;
              const isReceiver = item.sender === projectInfo?.receiverCode;
              const isAdmin = item.sender === projectInfo?.adminCode;
              const isDiffDate = !!prevDate && !!currentDate && prevDate !== currentDate;
              const currentTransItem = transMessageList?.find(trans => trans.id === item._id);
              // console.log('transMessageList', transMessageList);
              // console.log('currentTranslation', currentTranslation);
              // if (moment().date(item.sendDate))
              // console.log('userCode', userCode);
              // console.log('item.sender', item.sender);
              // console.log(isSelf, 'isSelf');
              // console.log('item.company', item.company);
              // if (item.eventType === 'enter' && !isSelf) {
              //   return (
              //     <p className="projectChat__talk_new_user" key={index}>
              //       {t('CHAT_ENTERED', { user: item.company })}
              //     </p>
              //   );
              // }
              // if (item.eventType === 'leave' && !isSelf) {
              //   return (
              //     <p className="projectChat__talk_new_user" key={index}>
              //       {t('CHAT_LEAVE', {
              //         user: _.find(participant, i => i.userCode === item.sender)?.company,
              //       })}
              //     </p>
              //   );
              // }
              if (item.eventType === 'message') {
                return (
                  <Fragment key={index}>
                    {isDiffDate && (
                      <div className="projectChat__alert_box">
                        <div className="projectChat__date_alert">
                          {moment(prevItem.sendDate).format('MMM. DD. YYYY')}
                        </div>
                      </div>
                    )}

                    <div
                      className={cx('projectChat__talk_box', {
                        self: isSelf,
                        partner: !isSelf,
                      })}
                    >
                      {!isSelf && (
                        <div
                          className={cx('projectChat__talk_name', {
                            sender: isSender,
                            receiver: isReceiver,
                            admin: isAdmin,
                          })}
                        >
                          {_.find(participant, i => i.userCode === item.sender)?.company}
                        </div>
                      )}
                      <div className="projectChat__talk_content_box">
                        {/* <div style={{ width: '100%' }}>
                            <button
                              className="btn-reset projectChat__talk_translation"
                              onClick={() => onTranslation(item._id)}
                            >
                              See {translationIdList.includes(item._id) ? 'origin' : 'translation'}
                            </button>
                          </div> */}
                        <div className="projectChat__talk_time_box">
                          {!isSelf && (
                            <button
                              className={cx('btn-reset projectChat__talk_translation', {
                                on: currentTransItem?.active,
                              })}
                              onClick={() => onTranslation({ id: item._id, message: item.message })}
                            >
                              {/* See {translationIdList.includes(item._id) ? 'origin' : 'translation'} */}
                              <GTranslateIcon fontSize="inherit" color="inherit" />
                            </button>
                          )}
                          <br />
                          <span className="projectChat__talk_time">
                            {moment(item.sendDate).format(' HH:mm')}
                          </span>
                        </div>
                        <div className="projectChat__talk_content">
                          {currentTransItem?.active ? (
                            <EscapeConvert content={currentTransItem?.transMessage || ''} />
                          ) : (
                            <EscapeConvert content={item.message || ''} />
                          )}
                        </div>
                        {/* {!isSelf && (
                            <span className={cx('projectChat__talk_time', { partner: !isSelf })}>
                              {moment(item.sendDate).format(' HH:mm')}
                            </span>
                          )} */}
                        {/* <div className="projectChat__talk_date">
                            <span className="projectChat__talk_time">
                              {moment(item.sendDate).format(' HH:mm')}
                            </span>
                          </div> */}
                      </div>
                    </div>
                    {lastUnreadMessageId === item._id && (
                      <div className="projectChat__alert_box">
                        <div className="projectChat__read">
                          <T>CHAT_READ</T>
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              }
            })}
          {/* {chatListAllItems?.length > 0 &&
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
                    <div className="projectChat__talk_content_box">
                      {!isSelf && (
                        <CustomText fontSize={12} marginBottom={5}>
                          {_.find(participant, i => i.userCode === item.sender)?.company}
                        </CustomText>
                      )}
                      <div className="projectChat__talk_content">
                        <EscapeConvert content={item.message || ''} />
                      </div>
                      <div className="projectChat__talk_date">
                        <span className="projectChat__talk_time">
                          {moment(item.sendDate).format('MMM. DD. YYYY HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })} */}
          {/* <div
              className={cx('projectChat__talk_box', {
                client: true,
              })}
            >
              <div className="projectChat__talk_date">
                <span className="projectChat__talk_time">{moment().format('MMM. DD. YYYY HH:mm')}</span>
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
                <span className="projectChat__talk_time">{moment().format('MMM. DD. YYYY HH:mm')}</span>
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
      display: flex;
      flex-direction: column-reverse;
      height: 530px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 5px 0px;
    }
    .projectChat__alert_box {
      display: flex;
      margin-top: 20px;
    }
    .projectChat__read,
    .projectChat__date_alert {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      height: 20px;
      padding: 0 15px;
      background-color: ${color.gray_b5};
      border-radius: 10px;
      font-size: 11px;
      color: white;
      font-weight: 300;
      line-height: 0;
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
      font-size: 14px;

      &:not(:last-child) {
        margin-top: 10px;
      }

      .projectChat__talk_translation {
        font-size: 18px;
        color: ${color.gray_b5};
        text-decoration: underline;
        &.on {
          color: ${color.blue};
        }
      }
      .projectChat__talk_time {
        display: inline-block;
        vertical-align: bottom;
        font-size: 10px;
        color: #9194a4;
        font-weight: 300;
      }
      .projectChat__talk_name {
        font-size: 12px;
        margin-bottom: 5px;
        font-style: italic;
        &.sender {
          color: ${color.client_color};
        }
        &.receiver {
          color: ${color.designer_color};
        }
        &.admin {
          color: ${color.admin_color};
        }
      }
      .projectChat__talk_content_box {
        display: inline-flex;
        align-items: flex-end;
        flex-wrap: wrap;
      }
      .projectChat__talk_content {
        display: inline-block;
        position: relative;
        max-width: 248px;
        padding: 10px;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.3;
        text-align: left;
      }
      &.self {
        padding-left: 15px;
        text-align: right;
        .projectChat__talk_content {
          background-color: #dbf0ff;
          border-top-right-radius: 0;
        }
        .projectChat__talk_time_box {
          margin-right: 2px;
        }
      }
      &.partner {
        padding-right: 15px;
        /* text-align: left; */
        .projectChat__talk_content_box {
          flex-direction: row-reverse;
        }
        .projectChat__talk_content {
          position: relative;
          background-color: #eeeeee;
          border-top-left-radius: 0;
        }
        .projectChat__talk_time_box {
          margin-left: 2px;
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
          width: 85%;
          height: 100%;
          .MuiInputBase-root {
            padding: 10px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          textarea {
            padding: 0;
            height: 100% !important;
            overflow-y: auto !important;
          }
        }
        .button {
          width: 15%;
          height: 100%;
          min-width: initial;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          img {
            width: 15px;
          }
        }
      }
    }
  `,
};
