import React, { createContext, useEffect } from 'react';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';

export const DesignerContext = createContext();

// Designer LocalFileList, PortfolioInfo
export function DesignerProvider({ value, children }) {
  const deletePortfolio = useCheckSetInput(new Set([]));
  const portfolioFileList = useInput([]);
  // const deletePortfolio
  // const localFileListCt = useInput([]);

  // useEffect(() => {
  //   console.log('localFileListCt', localFileListCt.value);
  // }, [localFileListCt.value]);

  return (
    <DesignerContext.Provider
      value={{
        deletePortfolio,
        portfolioFileList,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
