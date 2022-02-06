import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularLoading from 'components/base/loading/CircularLoading';
import styled from 'styled-components';

/**
 * const loadConfig ={
    userCode:authReducer.signIn.profile.userCode,
    page:caseList.page
  }
 <InfiniteScroll
    maxDataLength={30}
    dataLength={caseList.load.length}
    next={()=>LISTING_CASE_LOAD_SAGAS(loadConfig)}
    unMount={()=>LISTING_CASE_LOAD.init()}
    height={425}
  >
    <CaseLoadList 
      list={caseList.load}
      onChange={handleClick('list')}
    />
  </InfiniteScroll>
 * @param {*} props 
 */
export default function CustomInfiniteScroll(props) {
  const {
    dataLength,
    maxDataLength,
    children,
    endMessage,
    loader,
    next,
    unMount,
    maxDataMessage,
  } = props;

  useEffect(() => {
    next && next();
    return () => {
      unMount && unMount();
    };
  }, []);

  let hasMore = true;
  if (dataLength >= maxDataLength || props.isEnd || dataLength === 0) {
    hasMore = false;
  }

  let endText = maxDataMessage
    ? maxDataMessage
    : `리스트는 ${maxDataLength}개 까지만 보여지게 됩니다.`;
  if (props.isEnd) endText = '데이터가 더 이상 존재하지 않습니다..';
  if (dataLength === 0) endText = '데이터가 없습니다..';

  return (
    <Styled.CustomInfiniteScroll data-component-name="CustomInfiniteScroll">
      <InfiniteScroll
        {...props}
        hasMore={hasMore}
        loader={
          loader ? (
            loader
          ) : (
            <div className="align__center">
              <CircularLoading size={20} />
            </div>
          )
        }
        endMessage={
          endMessage ? (
            endMessage
          ) : (
            <div className="align__center">
              <p className="scroll__info">{endText}</p>
            </div>
          )
        }
      >
        {children}
      </InfiniteScroll>
    </Styled.CustomInfiniteScroll>
  );
}

const Styled = {
  CustomInfiniteScroll: styled.div`
    .align__center {
      text-align: center;
    }
    .scroll__info {
      font-size: 14px;
      margin-top: 15px;
    }
  `,
};
