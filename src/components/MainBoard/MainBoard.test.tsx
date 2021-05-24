import React from 'react';
import { shallow } from 'enzyme';
import MainBoard from './MainBoard';

describe('<MainBoard />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<MainBoard />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
