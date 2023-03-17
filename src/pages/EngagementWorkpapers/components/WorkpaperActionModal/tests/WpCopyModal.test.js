import React from 'react';
import { WpCopyModalContent } from '../WpCopyModal';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';

window.scrollTo = jest.fn();

describe('Copy Workpaper Modal', () => {
  let store;
  let useDispatchFn;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      workpaper: ImmutableMap({
        isCopyingWorkpaper: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);

    store.clearActions();
  });

  it('should render', () => {
    const output = shallow(<WpCopyModalContent />);

    expect(output.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should dispatch copyWorkpaper', () => {
    const output = shallow(<WpCopyModalContent workpaper={{ id: '1234-5678-9012-3456' }} />);
    const button = output.find('[dataInstance="CopyWorkpaper-Primary"]');
    button.simulate('click');

    expect(output.length).toBe(1);
    expect(useDispatchFn).toHaveBeenCalledTimes(2);
  });
});
