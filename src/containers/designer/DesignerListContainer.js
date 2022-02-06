import React, { useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { DesignerActions, UtilActions } from 'store/actionCreators';
import DesignerList from 'components/designer/DesignerList';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import Axios from 'axios';
import useFetchLoading from 'lib/hooks/useFetchLoading';

export default function DesignerListContainer() {
  const {
    designersData,
    fetchDesignersSuccess,
    toggleLikeDesignerSuccess,
    supportCountryList,
  } = useShallowSelector(state => ({
    designersData: state.designer.designers.data,
    fetchDesignersSuccess: state.designer.designers.success,
    toggleLikeDesignerSuccess: state.designer.toggleLikeDesigner.success,
    supportCountryList: state.util.supportCountries.data?.languageList,
  }));
  const designerList = designersData?.list;
  const pagingData = designersData?.pagingData;
  const [designerListDataStack, setDesignerListDataStack] = useState([]);
  const likeUserSetData = useCheckSetInput(new Set([]));

  const language = useInput([]);
  // 0: latest, 1 : 평점 높은순, 2: 이름 내림차순, 3: 이름 오름차순
  const order = useInput(0);
  const keyword = useInput('');
  const page = useInput(1);
  // const [pageChecker, setPageChecker] = useState(null);
  let searchParams = {
    languageGroup: language.value?.join('%'),
    order: order.value,
    page: page.value,
    keyword: keyword.value,
  };

  // SECTION: init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    DesignerActions.fetch_designers_request(searchParams);
  }, []);

  // SECTION: onChange
  useDidUpdateEffect(() => {
    // language, order 변경 시, page, designer list stack 초기화
    DesignerActions.fetch_designers_request({ ...searchParams, page: 1 });
    page.setValue(1);
    // setDesignerListDataStack([]);
  }, [language.value, order.value]);

  // page.value 별도 onChange 처리, 1은 예외
  useDidUpdateEffect(() => {
    if (page.value === 1) return;
    DesignerActions.fetch_designers_request({ ...searchParams, page: page.value });
  }, [page.value]);

  // useEffect(() => {
  //   // console.log('page Checker __', pageChecker);
  //   setPageChecker(page.value >= pagingData?.totalPage);
  // }, [page.value, pagingData?.totalPage]);

  // response api - designerList
  useDidUpdateEffect(() => {
    if (fetchDesignersSuccess) {
      // console.log('work??');
      //designer list를 스택에 쌓기 전에 현재 불러온 리스트의 like list를 set에 담음
      const likeUserList = designerList.reduce((acc, curr) => {
        if (!!curr.likeStatus) return acc.concat(curr.userCode);
        return acc;
      }, []);
      // 자연스러운 랜더링을 위한 초기화 타이밍
      if (page.value === 1) {
        likeUserSetData.setValue(new Set(likeUserList));
        setDesignerListDataStack(designerList);
      } else {
        likeUserSetData.setValue(draft => new Set([...draft, ...likeUserList]));
        setDesignerListDataStack(draft => [...draft, ...designerList]);
        // console.log('likeUserList', new Set([...likeUserList]));
        //
      }
      // designerList.forEach(item => {
      //   if (item.likeStatus) {
      //     likeUserSetData.onChange({ value: item.userCode });
      //   }
      // });
    }
  }, [fetchDesignersSuccess === true, page.value]);

  // TEST:
  // useEffect(() => {
  //   console.log('likeUserSetData', likeUserSetData.value);
  // }, [likeUserSetData.value]);

  const handleLike = config => {
    const { status, designerUserCode } = config;
    // console.log(config, 'config');
    // console.log(!status ? 1 : 0, 'sdfsdf');
    // console.log(!likeUserSetData.value.has(designerUserCode) ? 1 : 0);
    // request api
    DesignerActions.toggle_like_designer_request({
      designerUserCode: designerUserCode,
      // status: !status ? 1 : 0,
      status: !likeUserSetData.value.has(designerUserCode) ? 1 : 0,
    });
  };

  const handleSearch = () => {
    searchParams = {
      ...searchParams,
      // keyword: keyword.value,
      keyword: keyword.value,
      page: 1,
    };
    // request api
    DesignerActions.fetch_designers_request(searchParams);
    // search 시, page, designer list stack 초기화
    page.setValue(1);
    // setDesignerListDataStack([]);
  };

  // 사용X -> 공통 컴포넌트 전환
  // const handleViewMore = () => {
  //   const nextPage = page.value + 1;
  //   searchParams = {
  //     ...searchParams,
  //     // keyword: keyword.value,
  //     page: nextPage,
  //   };
  //   DesignerActions.fetch_designers_request(searchParams);
  //   page.setValue(nextPage);
  // };

  //request api
  // axios.get().then(res => {
  //   setData(res);
  //   setLoading(false);
  // }.finally());

  const { isFetchSuccess } = useFetchLoading({ fetchDesignersSuccess });
  if (!isFetchSuccess) return null;
  return (
    <DesignerList
      supportCountryList={supportCountryList}
      language={language}
      order={order}
      keyword={keyword}
      // pageChecker={pageChecker}
      designerList={designerListDataStack}
      likeUserSetData={likeUserSetData}
      page={page}
      pagingData={pagingData}
      onLike={handleLike}
      onSearch={handleSearch}
      // onViewMore={handleViewMore}
    />
  );
}
