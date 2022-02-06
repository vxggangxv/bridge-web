import React, { useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { DesignerActions, UtilActions } from 'store/actionCreators';
import DesignerList_renewal from 'components/designer/DesignerList_renewal';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';

export default function DesignerListContainer_renewal() {
  const {
    designersData,
    toggleLikeDesignerSuccess,
    designersDataSuccess,
    supportCountryList,
  } = useShallowSelector(state => ({
    designersData: state.designer.designers.data,
    designersDataSuccess: state.designer.designers.success,
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
  let searchParams = {
    languageGroup: language.value?.join('%'),
    order: order.value,
    page: page.value,
    keyword: keyword.value,
  };

  // init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    DesignerActions.fetch_designers_request(searchParams);
  }, []);

  // onChange
  useDidUpdateEffect(() => {
    // language, order 변경 시, page, designer list stack 초기화
    page.setValue(1);
    setDesignerListDataStack([]);
    DesignerActions.fetch_designers_request(searchParams);
  }, [
    // page.value,
    language.value,
    order.value,
  ]);

  useDidUpdateEffect(() => {
    if (designersDataSuccess) {
      //designer list를 스택에 쌓기 전에 현재 불러온 리스트의 like list를 set에 담음
      designerList.forEach(item => {
        if (item.likeStatus) {
          likeUserSetData.onChange({ value: item.userCode });
        }
      });
      setDesignerListDataStack([...designerListDataStack, ...designerList]);
    }
  }, [designersDataSuccess === true]);

  // DEBUG: 백엔드 에러 찾는중
  const handleLike = config => {
    const { status, designerUserCode } = config;
    console.log(config, 'config');
    console.log(!status ? 1 : 0, 'sdfsdf');
    // request api
    DesignerActions.toggle_like_designer_request({
      designerUserCode: designerUserCode,
      status: !status ? 1 : 0,
    });
  };

  const handleSearch = () => {
    searchParams = {
      ...searchParams,
      // keyword: keyword.value,
      keyword: keyword.value,
    };
    // request api
    DesignerActions.fetch_designers_request(searchParams);
    // search 시, page, designer list stack 초기화
    page.setValue(1);
    setDesignerListDataStack([]);
  };

  const handleViewMore = () => {
    const nextPage = page.value + 1;
    searchParams = {
      ...searchParams,
      // keyword: keyword.value,
      page: nextPage,
    };
    DesignerActions.fetch_designers_request(searchParams);
    page.setValue(nextPage);
  };

  if (!designersData) return null;
  return (
    <DesignerList_renewal
      supportCountryList={supportCountryList}
      language={language}
      order={order}
      keyword={keyword}
      page={page}
      pagingData={pagingData}
      designerList={designerListDataStack}
      likeUserSetData={likeUserSetData}
      onLike={handleLike}
      onSearch={handleSearch}
      onViewMore={handleViewMore}
    />
  );
}
