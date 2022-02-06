import React from 'react';
import { render } from '@testing-library/react';
import MainHomeContainer from './MainHomeContainer';

test('renders learn react link', () => {
  const { getByText } = render(<MainHomeContainer />);
  const linkElement = getByText(/MainHome/i);
  expect(linkElement).toBeInTheDocument();
});
