import { useShallowSelector } from 'lib/utils';
import React from 'react';
import Helmet from 'react-helmet';

// TODO: 차후에 mapper로 이동
const locales = {
  en: 'en_US',
  ko: 'ko_KR',
};

function AppMeta(props) {
  const { language } = useShallowSelector(state => ({
    language: state.base.language,
  }));

  // NOTE: 차후 설정된 값으로 변경
  const siteName = 'DOF Bridge';
  const lang = locales[language] || locales['ko'];
  const title = props.title + ' | DOF Bridge' || siteName;
  const descriptionValue =
    language === 'ko'
      ? '전세계 치과와 기공사를 연결해주는 온라인 플랫폼'
      : 'An online platform that connects dentists and engineers around the world.';
  const description = props.description || descriptionValue;
  const keywords =
    'DOF Bridge, Bridge, dentists, engineers, platform, 브릿지, 디오에프 브릿지, 디오에프연구소, 치과의사, 엔지니어, 플랫폼';
  // const image = props.image !== undefined && `${props.image}`;
  const image = props.image || require('static/images/dofbridge_og.png') || null;
  // const favicon = props.favicon || null;
  // const touchIcon = props.touchIcon || null;
  const canonical = props.canonical || 'https://www.dofbridge.com';
  const type = props.type || 'website';

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {canonical && <link rel="canonical" href={canonical} />}
        {/* <link rel="alternate" media="only screen and (max-width: 640px)" href="http://m.example.com/"> */}
        {/* public폴더에서 */}
        {/* {image && <link rel="image_src" href={image} />}
        {favicon && <link rel="shortcut icon" href={favicon} />}
        {touchIcon && <link rel="apple-touch-icon" href={touchIcon} />} */}

        {/* facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {image && <meta property="og:image" content={image} />}
        {canonical && <meta property="og:url" content={canonical} />}
        {/* 
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locales[lang]} />
        <meta property="fb:pages" content={siteName} />
        <meta property="fb:app_id" content={} />
         */}

        {/* twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        {image && <meta name="twitter:image" content={image} />}
        {canonical && <meta property="twitter:url" content={canonical} />}
        {/* 
        <meta name="twitter:site" content="@트위터아이디" />
        <meta name="twitter:creator" content="@트위터아이디" />
         */}
      </Helmet>
    </>
  );
}

export default AppMeta;
