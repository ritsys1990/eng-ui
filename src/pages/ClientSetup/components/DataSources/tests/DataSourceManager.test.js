import React, * as ReactHooks from 'react';
import DataSourceManager, { DataSourceManagerModal } from '../DataSourceManager';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { findByInstanceProp } from 'src/utils/testUtils';
import { ComponentNames, DataSourceTypes } from '../constants';
import { initialState as securityInitialState } from 'src/store/security/reducer';

const { MANAGE_DATASOURCE: COMPONENT_NAME } = ComponentNames;

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: ImmutableMap({ client: { id: 'xxxx', name: 'xxxx', entities: [{ id: '000', name: 'e1' }] } }),
  bundles: ImmutableMap({ sourceSystems: [{ id: 'xxx', name: 'xxx', versions: [{ id: 'xxx', name: 'xxxx' }] }] }),
  security: securityInitialState,
};

describe('Client Setup DataSourceManager', () => {
  let store;
  let effects;
  let mockDispatch;

  beforeEach(() => {
    store = { ...initialState };
    effects = {};
    mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    jest.spyOn(ReactHooks, 'useMemo').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation((f, deps) => {
      const id = `${f}${deps}`;
      const current = effects[id];
      if (!current || !current?.deps?.every((v, key) => deps[key] === v)) {
        const clean = f();
        effects[id] = { f, deps, clean };
      }
    });
    jest
      .spyOn(ReactHooks, 'useState')
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState);
  });

  it.skip('should render', () => {
    const onCloseHandler = jest.fn();
    const wrapper = shallow(<DataSourceManagerModal isOpen onClose={onCloseHandler} />);
    Object.values(effects)
      ?.find(x => !!x.clean)
      .clean();
    expect(wrapper.exists()).toBe(true);
  });

  it.skip('should should handle types', () => {
    const onCloseHandler = jest.fn();
    const wrapper = shallow(<DataSourceManagerModal isOpen onClose={onCloseHandler} />);
    let typeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TypesField`)?.find('Radio');
    let handleTypeChange = typeOptions.at(0).prop('onOptionSelected');
    let transferOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TransferModesField`)?.find('Radio');

    expect(transferOptions.length).toBe(2);
    handleTypeChange(DataSourceTypes.CLIENT_SCRIPT);
    wrapper.update();
    transferOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TransferModesField`)?.find('Radio');
    typeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TypesField`)?.find('Radio');
    expect(transferOptions.length).toBe(1);
    handleTypeChange = typeOptions.at(0).prop('onOptionSelected');
    handleTypeChange(DataSourceTypes.THIRD_PARTY);
    wrapper.update();
    typeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TypesField`)?.find('Radio');
    handleTypeChange = typeOptions.at(0).prop('onOptionSelected');
    handleTypeChange(DataSourceTypes.CLIENT_FS);
    wrapper.update();
    typeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TypesField`)?.find('Radio');
    handleTypeChange = typeOptions.at(0).prop('onOptionSelected');
    handleTypeChange(DataSourceTypes.CLIENT_SOURCE);
    wrapper.update();
  });

  it('should should handle field change', () => {
    const onCloseHandler = jest.fn();
    const wrapper = shallow(<DataSourceManagerModal isOpen onClose={onCloseHandler} />);
    let nameInput = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NameField`);
    const handleChange = nameInput.prop('onChange');
    handleChange({ target: { value: 'ds name' } });
    wrapper.update();
    nameInput = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NameField`);
    expect(nameInput.prop('value')).toBe('ds name');
  });

  it.skip('should handle submit', async () => {
    const onCloseHandler = jest.fn();
    const wrapper = shallow(<DataSourceManagerModal isOpen onClose={onCloseHandler} />);
    let handleSubmit = wrapper.find('Modal').prop('onPrimaryButtonClick');
    handleSubmit();
    expect(onCloseHandler).toHaveBeenCalledTimes(0);
    wrapper.update();
    const handleTypeChange = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TypesField`)
      ?.find('Radio')
      .at(0)
      .prop('onOptionSelected');
    handleTypeChange(DataSourceTypes.CLIENT_FS);
    wrapper.update();
    const handleNameChange = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NameField`).prop('onChange');
    handleNameChange({ target: { value: 'ds name' } });
    wrapper.update();
    const handleEntitiesChange = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EntitiesField`).prop('onChange');
    handleEntitiesChange([{ id: 'xxx', name: 'sample entity' }]);
    wrapper.update();
    handleSubmit = wrapper.find('Modal').prop('onPrimaryButtonClick');
    await handleSubmit();
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
  });

  it.skip('should render modal wrapper', async () => {
    const onCloseHandler = jest.fn();
    const wrapper = shallow(<DataSourceManager isOpen onClose={onCloseHandler} />);
    let modal = wrapper.find('DataSourceManagerModal');
    expect(modal.exists()).toBe(true);
    const onDidCloseHandler = modal.prop('onDidClose');
    onDidCloseHandler();
    wrapper.update();
    modal = wrapper.find('DataSourceManagerModal');
    expect(modal.exists()).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
