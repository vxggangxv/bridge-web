import React, { useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { DesignerActions, UtilActions } from 'store/actionCreators';
import DesignerList from 'components/designer/DesignerList';
import useInput from 'lib/hooks/useInput';

export default function DesignerListContainer() {
  const { designersData, toggleLikeDesignerSuccess, supportCountryList } = useShallowSelector(
    state => ({
      designersData: state.designer.designers.data,
      toggleLikeDesignerSuccess: state.designer.toggleLikeDesigner.success,
      supportCountryList: state.util.supportCountries.data?.languageList,
    }),
  );
  const designerList = designersData?.list;
  const pagingData = designersData?.pagingData;
  // const supportCountryListLabel = [
  //   { iso2: 'AS', label: 'English' },
  //   { iso2: 'CN', label: 'China' },
  //   { iso2: 'DE', label: 'Germany' },
  //   { iso2: 'JP', label: 'Japan' },
  //   { iso2: 'KR', label: 'Korea' },
  // ];
  // const languageList = supportCountryList?.map(item => ({
  //   iso2: item.iso2,
  //   label: supportCountryListLabel.find(o => o.iso2 === item.iso2)?.label,
  // }));
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
    console.log(searchParams, 'searchParams');
    DesignerActions.fetch_designers_request(searchParams);
  }, [page.value, language.value, order.value]);

  // response status
  // useDidUpdateEffect(() => {
  //   console.log(supportCountryList, 'supportCountryList');
  //   languageList = supportCountryList?.map(item => ({
  //     iso2: item.iso2,
  //     label: item.iso2 === supportCountryListLabel.iso2 ? supportCountryListLabel.label : '',
  //   }));
  // }, [supportCountryList?.length > 0]);

  // useEffect(() => {
  //   console.log(designersData, 'designersData');
  //   console.log(designerList, 'designerList');
  //   console.log(pagingData, 'pagingData');
  // }, [designersData]);

  // useEffect(() => {
  //   console.log(language.value, 'language.value');
  // }, [language.value]);

  // "profileImg": null,
  // "userCode": "GZ20SEP-0001",
  // "company": "골든치과기공소",
  // "grade": null,
  // "languageGroup": null,
  // "likeStatus": 0

  // "page": 1,
  // "startPage": 1,
  // "endPage": 1,
  // "totalPage": 1,
  // "prevPage": 1,
  // "nextPage": 1

  // const handleLanguage = language => {
  //   searchParams = {
  //     ...searchParams,
  //     language,
  //   };
  //   // request api
  //   DesignerActions.fetch_designers_request(searchParams);
  // };

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
  };

  // respose api
  useDidUpdateEffect(() => {
    if (toggleLikeDesignerSuccess) {
      DesignerActions.fetch_designers_request(searchParams);
    }
  }, [toggleLikeDesignerSuccess === true]);

  if (!designersData) return null;
  return (
    <DesignerList
      supportCountryList={supportCountryList}
      language={language}
      order={order}
      keyword={keyword}
      page={page}
      pagingData={pagingData}
      designerList={designerList}
      onLike={handleLike}
      onSearch={handleSearch}
    />
  );
}
