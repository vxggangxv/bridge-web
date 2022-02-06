import React, { useEffect } from 'react';
import styled from 'styled-components';
import { font, color } from 'styles/utils';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import useInput from 'lib/hooks/useInput';

// import test from 'static/files/terms/testHtml.htm';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

function ModalTerms(props) {
  const { type = '' } = props;
  const { t } = useTranslation();
  const termsType = useInput(type);

  // JUN: 내용 받은 후 변경
  const contentObj = {
    launcher: {
      title: t('POLICY_TERMS_TITLE'),
      content: t('POLICY_TERMS_CONTENT'),
    },
    process: {
      title: t('POLICY_PRIVACY_TITLE'),
      content: t('POLICY_PRIVACY_CONTENT'),
    },
    // TEMP: 사용 X
    finance: {
      title: '전자금융거래이용약관',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
    collection: {
      title: '개인정보 수집 및 이용',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
    offer: {
      title: '개인정보 제공 내용',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
  };

  let currentContent = contentObj[type];
  if (!currentContent) {
    currentContent = null;
  }

  return (
    <Styled.ModalTerms data-component-name="ModalTerms">
      <div className="modalTerms__container">
        <h1 className="title">
          <T>{currentContent.title}</T>
        </h1>
        <p className="content">
          <T>{currentContent.content}</T>
        </p>
      </div>
    </Styled.ModalTerms>
  );
}

const Styled = {
  ModalTerms: styled.div`
    position: relative;
    padding: 50px;
    height: 100%;
    .modalTerms__container {
      /* width: 1280px; */
    }
    .title {
      margin-bottom: 20px;
      border-bottom: 1px solid #ececec;
      padding-bottom: 10px;
      ${font(22, color.black_font)};
    }
    .content {
      /* height: 450px; */
      height: 100%;
      overflow-y: auto;
      ${font(14, color.black_font)};
      line-height: 16px;
    }
  `,
};

export default ModalTerms;
