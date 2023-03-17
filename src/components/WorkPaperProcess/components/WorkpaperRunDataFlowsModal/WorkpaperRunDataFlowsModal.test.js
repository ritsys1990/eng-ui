import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import WorkpaperRunDataFlowsModal, { COMPONENT_NAME } from './WorkpaperRunDataFlowsModal';
import { findByInstanceProp } from '../../../../utils/testUtils';
import * as DataWranglerStoreActions from '../../../../store/dataWrangler/actions';

const mockWorkpaperId = '123';

const setUp = (props = {}) => {
  return shallow(
    <WorkpaperRunDataFlowsModal
      trifactaFlowId={16594}
      engagementId='123'
      workpaperId={mockWorkpaperId}
      isOpen
      onClose={() => {}}
      onDone={() => {}}
      isRunningWorkpaper={() => {}}
      {...props}
    />
  );
};

const flowNodes = [
  {
    id: 73516,
    wrangled: true,
    recipe: {
      id: 70108,
      name: 'Test 1',
      description: null,
      active: true,
    },
  },
  {
    id: 73288,
    wrangled: true,
    recipe: {
      id: 69894,
      name: 'test 2',
      description: null,
      active: true,
    },
  },
];

describe('WorkpaperRunDataFlowsModal test suite', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      dataWrangler: ImmutableMap({
        isRunningSpecificDataFlows: ImmutableMap({ [mockWorkpaperId]: false }),
        isFetchingFlowDetails: ImmutableMap({ [mockWorkpaperId]: false }),
        flowDetails: ImmutableMap({
          [mockWorkpaperId]: {
            id: 16594,
            name: 'Test',
            flowNodes: {
              data: flowNodes,
            },
          },
        }),
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it.skip('should call on change on selecting a checkbox', () => {
    const wrapper = setUp();
    const checkbox = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Checkbox-${flowNodes[0].id}`, 'Checkbox');
    expect(checkbox.length).toBe(1);
    checkbox.invoke('onChange')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should call on change on selecting a select all', () => {
    const wrapper = setUp();
    const checkbox = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SelectAll`, 'Checkbox');
    expect(checkbox.length).toBe(1);
    checkbox.invoke('onChange')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it('should dispatch actions to run specific data flows', () => {
    const mockRunSpecificDataFlows = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    const isRunningWorkpaper = jest.fn().mockReturnValue(false);

    jest.spyOn(DataWranglerStoreActions, 'runSpecificDataFlows').mockImplementation(() => mockRunSpecificDataFlows);

    const wrapper = setUp({ isRunningWorkpaper });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Modal`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockRunSpecificDataFlows).toHaveBeenCalledTimes(1);
  });
});
