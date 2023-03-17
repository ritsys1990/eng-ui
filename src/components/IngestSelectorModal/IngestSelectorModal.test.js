import React, * as ReactHooks from 'react';
import IngestSelectorModal from './IngestSelectorModal';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp, mockL10nContent } from '../../utils/testUtils';
import { INGEST_TYPES } from '../../pages/ContentLibrary/DataModels/constants/constants';

const COMPONENT_NAME = 'INGEST_SELECTOR_MODAL';
const mockFn = jest.fn();

const defaultProps = {
  isOpen: true,
  handleClose: mockFn,
  titleText: 'Title',
  selectedItem: { nameTech: 'TK_DM_Test_Ingest_DM' },
  ingestType: INGEST_TYPES.DMT,
  handleSubmit: mockFn,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<IngestSelectorModal {...mergedProps} />);
};

describe('Ingest Selector Modal', () => {
  let store;
  let useStateFn;

  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      contentLibraryDMs: ImmutableMap({
        allEnvironments: [{ name: 'dev1' }, { name: 'qas1' }],
        dmtsListToIngest: [
          { id: 'b65eade2-d2e8-4e95-9645-601448e45919', name: 'TK_DM_Test_Ingest_DMT', workpaperSource: 'Trifacta' },
        ],
      }),
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    store.clearActions();
  });

  it('should render', () => {
    const output = setUp();

    expect(output.length).toBe(1);
  });

  it.skip('should call change environment', () => {
    const output = setUp();
    const envSelect = findByInstanceProp(output, `${COMPONENT_NAME}-env`);
    envSelect.invoke('onChange')([{ name: 'dev1' }]);
    expect(useStateFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call change dmt', () => {
    const output = setUp();
    const ingSelect = findByInstanceProp(output, `${COMPONENT_NAME}-ingestItem`);
    ingSelect.invoke('onChange')([{ name: 'dev1' }]);
    expect(useStateFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call submit', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object') {
        return [[{ name: 'dev1' }], mockSetState];
      }

      return [initial, mockSetState];
    });
    const output = setUp();
    const ingModal = findByInstanceProp(output, `${COMPONENT_NAME}`);
    ingModal.invoke('onPrimaryButtonClick')();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
