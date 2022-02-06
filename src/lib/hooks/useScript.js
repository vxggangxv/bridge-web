import { useEffect } from 'react';

/**
 * useScript('https://use.typekit.net/foobar.js', true);
 * @param {string} url
 */
const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = typeof async === 'undefined' ? true : async;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useScript;
