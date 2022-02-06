import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useShallowSelector } from 'lib/utils';

const I18nLanguage = React.memo(function I18nLanguage({ i18n }) {
  const { language } = useShallowSelector(state => ({
    language: state.base.language,
  }));

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return null;
});

export default withTranslation()(I18nLanguage);
