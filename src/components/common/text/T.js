import React from 'react';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';
import EscapeConvert from 'components/common/convert/EscapeConvert';

/**
 * <T
 *  lang={''}
 *  text={''}
 * >message.hello</T>
 * <T>{t('n.selected', { n: 5 })}</T>
 * lang을 주면 강제로 변환할수도 있음.reducer에 영향 받지 않음.
 * @param {*} props
 */
const T = React.memo(function T(props) {
  const { children, t, lang = '', text = '', convert = true } = props;
  let content = text || children;

  if (lang) {
    content = i18next.getFixedT(lang)(content);
  }

  return convert === false ? content : <EscapeConvert content={t(content)} />;
  // return <span>{content}</span>;
});

export default withTranslation()(T);
// export default T;
