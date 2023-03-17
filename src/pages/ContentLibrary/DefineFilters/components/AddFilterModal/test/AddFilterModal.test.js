import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import AddFilterModal from '../AddFilterModal';
import LANGUAGE_DATA from 'src/languages/fallback.json';

const COMPONENT_NAME = 'AddNewFilter';

const defaultProps = {
  isOpen: true,
  handleClose: () => {},
  onPrimaryButtonClick: () => {},
  isEditMode: false,
  isChanged: false,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddFilterModal {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { bundleId: '12345' };
  }),
}));

describe('Client Domain Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      bundles: ImmutableMap({
        isCreatingSourceVersionFilter: false,
        isEditingSourceFilter: false,
        isFetchingFieldContext: false,
      }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    store.clearActions();
  });

  it('should call modal ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Modal`);
    expect(comp.length).toBe(1);
  });

  it('should call on close ', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Modal`);
    expect(modal.length).toBe(1);
    modal.invoke('onClose')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should handle primary button click with errors', () => {
    const wrapper = setUp();

    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Modal`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(0);
  });

  it('should handle primary button click with out errors', () => {
    const handleSubmit = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleSubmit });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Modal`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')('test');
    expect(mockSetState).toHaveBeenCalledTimes(0);
  });

  it('should handle secondary button click ', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Modal`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should render add filter for ', () => {
    const wrapper = setUp();
    const FilterForm = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Filter-Form`);
    expect(FilterForm.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
