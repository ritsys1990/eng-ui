import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import CreateNewWorkpaper from '../CreateNewWorkpaper';
import { initialState as errorInitialState } from '../../../../../store/errors/reducer';
import { initialState as workpaperInitialState } from '../../../../../store/workpaper/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';
import { COMPONENT_NAME } from '../constants/constants';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp, mockL10nContent } from '../../../../../utils/testUtils';
import { testHook } from '../../../../../utils/testHook';
import useTranslation, { nameSpaces } from '../../../../../hooks/useTranslation';

const mockTagId = '6c6d766e-430b-4a9a-ad45-97e53291bed3';

const tagsList = [
  {
    id: mockTagId,
    name: 'Manufacturing',
    tags: [],
  },
  {
    id: mockTagId,
    name: 'Education',
    tags: [],
  },
  {
    name: 'Transport',
    tags: [
      {
        id: mockTagId,
        name: 'Air',
      },
      {
        id: mockTagId,
        name: 'Electrical',
      },
    ],
  },
];

const defaultProps = {
  formValue: { NAME: 'TestWorkPaper', TAG_IDS: '123', URL: 'abc' },
  formState: {
    invalid: true,
    submitted: false,
    value: {
      description: '',
      name: '',
      tagIds: [],
      url: '',
      workpaperSource: 'TRIFACTA',
    },
  },
  loading: false,
  handleChanges: () => {},
  handleFormState: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CreateNewWorkpaper {...mergedProps} />);
};

const setUpHook = (params = {}) => {
  let hook;
  testHook(() => {
    hook = useTranslation(params);
  });

  return hook;
};

describe('Create New Workpaper Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      client: clientInitialState,
      security: securityInitialState,
      workpaper: ImmutableMap({
        ...workpaperInitialState,
        tags: tagsList,
      }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = null;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Parent`);

    expect(modal.length).toBe(1);
  });

  it('should display translated select options', () => {
    const output = setUp();
    const { t } = setUpHook();
    const select = findByInstanceProp(output, `${COMPONENT_NAME}-Tags`);
    const { newTagName, name } = select.props().options[0];
    const { newTagChildren = newTagName, nameChildren = name } = select.props().options[2].newTagsChildren[0];

    expect(output.length).toBe(1);
    expect(newTagName).toBe(t(name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP));
    expect(newTagChildren).toBe(t(nameChildren, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG));
  });

  it('should display select options in english (the default value) if the key does not exists in the localization content', () => {
    const output = setUp();
    const select = findByInstanceProp(output, `${COMPONENT_NAME}-Tags`);
    const tag = select.props().options[1].newTagName;
    const tagChildren = select.props().options[2].newTagsChildren[1].newTagName;

    expect(output.length).toBe(1);
    expect(tag).toBe(tagsList[1].name);
    expect(tagChildren).toBe(tagsList[2].tags[1].name);
  });
});
