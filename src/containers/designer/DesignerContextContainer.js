import React from 'react';
import DesignerContainer from './DesignerContainer';
import { DesignerProvider } from './DesignerContext';

export default function DesignerContextContainer(props) {
  return (
    <DesignerProvider>
      <DesignerContainer />
    </DesignerProvider>
  );
}
