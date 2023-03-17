import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import ExtractionScriptTable, { renderCTA } from '../ExtractionScriptTable';
import { ExtractionScriptContextMenuOptions } from '../constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const COMPONENT_NAME = 'ClientSetupConnections-Extraction';

const defaultProps = {
  dataSourceId: '1234',
  scripts: [],
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ExtractionScriptTable {...mergedProps} />);
};

describe('Extraction Script Table Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState,
      engagement: engagementInitialState,
      security: securityInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(14);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(6);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(24);
  });

  it('should render modal', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ExtractionScriptModal');
    expect(modal.length).toBe(1);
  });

  it.skip('should handle configure button', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ExtractionScriptModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render cta', () => {
    const event = { target: { value: 'Value' } };
    const row = { id: '123' };
    const clickHandler = jest.fn();

    const cta = shallow(renderCTA(row, clickHandler, [{}]));
    expect(cta.exists()).toBe(true);
    const button = findByInstanceProp(cta, `${COMPONENT_NAME}-MoreOptions-${row?.id}`, 'CtaButton');
    expect(button.length).toBe(1);
    button.invoke('onClick')(event);
    expect(clickHandler).toHaveBeenLastCalledWith(event, row);
  });

  it.skip('should handle cta menu close', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle cta menu edit option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onOptionClicked')({ id: ExtractionScriptContextMenuOptions.EDIT });
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle cta menu delete option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onOptionClicked')({ id: ExtractionScriptContextMenuOptions.DELETE });
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle delete modal close', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'DeleteExtractionScriptModal');
    expect(menu.length).toBe(1);
    menu.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });
});
