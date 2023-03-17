import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { Theme } from 'cortex-look-book';
import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import DMFieldTableAliasColumn from './DMFieldTableAliasColumn';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import * as useTranslationHooks from 'src/hooks/useTranslation';

const mockedProps = {
  pageName: 'CL_DATAMODEL_FIELDS_LIST',
  rowId: '12345',
  colName: 'aliases',
  aliases: ['Alias1', 'Alias2', 'Alias3', 'Alias4', 'Alias5'],
};
const setUp = (params = {}) => {
  const props = {
    ...mockedProps,
    ...params,
  };

  return shallow(<DMFieldTableAliasColumn {...props} />);
};

describe('Content Library Data Models Fields List Alias Column', () => {
  const mockSetState = jest.fn();
  let store;
  const t = () => {};
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t };
    });
  });

  it('should render', () => {
    const wrapper = setUp({});
    expect(wrapper.length).toBe(1);
  });

  it('should handle onClick of Collapse Button', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { scrollHeight: 10 } });
    const wrapper = setUp({});
    const buttonComponent = wrapper.find('Button');
    buttonComponent.simulate('click');
    wrapper.update();
    const collapsedColumn = wrapper.find({
      dataInstance: 'CL_DATAMODEL_FIELDS_LIST-DMFields-12345-aliases-Wrapper-false',
    });

    expect(collapsedColumn.length).toBe(1);
  });

  it('should not reder any alais', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { scrollHeight: 10 } });
    const wrapper = setUp({ aliases: [] });
    const buttonComponent = wrapper.find('Button');
    expect(buttonComponent.length).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
