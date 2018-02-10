import React from 'react';
import ReactDOM from 'react-dom';
import LinkButton from './LinkButton';
import { MemoryRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <LinkButton to="/">Hoi</LinkButton>
    </MemoryRouter>,
    div
  );
});
