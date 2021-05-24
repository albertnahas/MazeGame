import React from 'react';
import { shallow } from 'enzyme';
import SingleBlock from './SingleBlock';

describe('<SingleBlock />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SingleBlock />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
