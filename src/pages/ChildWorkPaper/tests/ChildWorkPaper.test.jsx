import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import routerData from 'react-router';
import thunk from 'redux-thunk';
import * as ReactReduxHooks from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { COMPONENT_NAME } from '../constants/constants';
import ChildWorkPaper from '../ChildWorkPaper';
import { findByInstanceProp, mockL10nContent } from '../../../utils/testUtils';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { initialState as errorInitialState } from '../../../store/errors/reducer';
import { initialState as workpaperInitialState } from '../../../store/workpaper/reducer';
import { initialState as childWorkpaperState } from '../../../store/childWorkpapers/reducer';
import { initialState as clientInitialState } from '../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../store/security/reducer';
import { initialState as wpProcessInitialState } from '../../../store/workpaperProcess/reducer';
import { initialState as step1InitialState } from '../../../store/workpaperProcess/step1/reducer';
import { initialState as step2InitialState } from '../../../store/workpaperProcess/step2/reducer';
import { initialState as step3InitialState } from '../../../store/workpaperProcess/step3/reducer';

import { Theme } from 'cortex-look-book';

const defaultProps = {
  wp: { name: 'test' },
  theme: Theme,
  match: { params: { workpaperId: 123 } },
};
const setUp = (props = { theme: Theme }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ChildWorkPaper {...mergedProps} />);
};
const childWP = { name: 'ChildPOCDemo', description: '' };
const mockLocation = {
  path: '/workpaper/:workpaperId/childworkpaper',
  hash: '',
  search: '',
  isExact: true,
  state: '',
  params: {
    workpaperId: '8da7d33e-79d7-4624-b1d3-0f3186e27529',
  },
};

const datamodels = [
  {
    id: 'e09eb8fe-fac9-4260-a8a8-e53fd73be802',
    parentId: '974c2656-d51b-48bd-b8eb-792f2783239c',
    lastUpdated: '2020-04-21T12:18:38.242Z',
    lastUpdatedBy: 'apeeta@deloitte.com',
    nameTech: 'TestDM',
    nameNonTech: 'F1',
    description: '',
    type: 'VarChar',
    isMandatory: true,
    isKey: false,
    dataFormat: null,
    tagIds: ['a5424f4d-e025-4a53-9941-a53b0a20130'],
  },
];
const mockDMTId1 = '1234-5678-9012-3456';
const mockDMTId2 = '6543-2109-8765-4321';
describe('Child work paper', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        general: wpProcessInitialState.merge({
          dmts: [{ id: mockDMTId1 }, { id: mockDMTId2 }],
          workpaper: { id: 123, name: 'test' },
        }),
        step1: step1InitialState.merge({
          inputs: [{ name: 'Input', dataRequestInfo: [{ bundleTransformationId: mockDMTId1 }] }],
        }),
        step2: step2InitialState.merge({ isDMTStepShown: true }),
        step3: step3InitialState.merge({
          outputs: ImmutableMap({
            [mockDMTId1]: [],
            dataTable: [{ id: 123, name: 'test1' }],
          }),
        }),
      },
      bundles: ImmutableMap({
        isFetchingBundleNameDetails: false,
        bundleNameDetails: {
          sourceVersionId: '1223232-2323',
          currentState: {
            publishState: 'Draft',
          },
        },
        sourceVersionFilters: [
          {
            description: 'Tere',
            fieldId: 'a58fed83-d81f-41fe-aa63-84aca6223f22',
            fieldName: 'PARENT_FLEX_VALUE',
            id: 'f36b8543-a957-40f9-aee4-4b6bab464dd6',
            filterOperations: [],
            name: 'FilterNew',
            tableId: '9e723aeb-ad2d-45b2-9adc-50c464c773d8',
            tableName: 'FND_FLEX_VALUE_HIERARCHIES',
            type: 'suggested',
          },
        ],
      }),
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      contentLibraryDMs: ImmutableMap({
        datamodels,
        isDataModelsFetching: true,
      }),
      client: clientInitialState,
      security: securityInitialState,
      workpaper: ImmutableMap({
        ...workpaperInitialState,
        Name: childWP.Name,
        workpaperSource: 'Trifacta',
      }),
      childWorkpapers: childWorkpaperState.merge({
        isDeletingChildWorkpaper: true,
        childWorkPapersList: [
          { id: '1000', name: 'test', description: 'test', childWorkPaperStatus: 'inprogress' },
          { id: '1000', name: 'test', description: 'test', childWorkPaperStatus: 'Draft' },
        ],
      }),
    });
  });
  const mockDispatch = jest.fn().mockImplementation(action => {
    store.dispatch(action);

    return Promise.resolve(true);
  });
  const mockSetState = jest.fn();

  jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
  jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

  jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  jest.spyOn(routerData, 'useParams').mockReturnValue({ params: { workpaperId: 123 }, outputId: 123 });
  jest.spyOn(routerData, 'useLocation').mockReturnValue(mockLocation);
  jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

  it.skip('should render Tooltip ', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'object') {
        value = ['1000'];
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step2`);
    expect(component.length).toBe(1);
    const btnComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-GenerateOutput`);
    expect(btnComponent.length).toBe(1);
    btnComponent.invoke('onClick')();
    const tooltipComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-GenerateOutputTooltip`);
    expect(tooltipComponent.length).toBe(1);
  });
  it.skip('should render step-1', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step1`);
    expect(accordion.length).toBe(1);
  });

  it.skip('should render header step-1', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step1`);

    expect(accordion.length).toBe(1);
    const header = shallow(accordion.prop('header').render());
    expect(header.length).toBe(1);
  });
  it.skip('should render step -1 onclck', () => {
    const event = { target: { dataset: { instance: 'Value' } } };

    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step1`);
    accordion.invoke('onClick')(event);
    expect(accordion.length).toBe(1);
  });
  it.skip('should render step -1 onclck when instance is same', () => {
    const event = { target: { dataset: { instance: `${COMPONENT_NAME}-Step1_Accordion-Header` } } };
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step1`);
    accordion.invoke('onClick')(event);
    expect(accordion.length).toBe(1);
  });
  it.skip('should render Step-2 onclick ', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step2`);
    component.invoke('onClick')();
    expect(component.length).toBe(1);
  });
  it.skip('should render header step-2', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Step2`);

    expect(accordion.length).toBe(1);
    const header = shallow(accordion.prop('header').render());
    expect(header.length).toBe(1);
  });

  it.skip('should render AddAnotherChild', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'object') {
        value = ['1000', '2000'];
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const addAnotherComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddAnotherChild`);
    expect(addAnotherComponent.length).toBe(1);
    addAnotherComponent.invoke('onClick')();
  });

  it.skip('should render ChildWorkpaperTable', () => {
    const wrapper = setUp();
    const addAnotherComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ChildWorkpaperTable`);
    expect(addAnotherComponent.length).toBe(1);
    addAnotherComponent.invoke('hideGenerateOutputErrorMessage')();
    addAnotherComponent.invoke('onChildWpChecked')({ id: 1000 }, true);
    addAnotherComponent.invoke('onCheckboxAllChecked')(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
