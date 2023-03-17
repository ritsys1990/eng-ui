import { validate, getErrors, getTableHeaders } from '../utils/utils';
import { FormErrorModel } from '../constants/constants';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

const row = ['abc.com'];

describe('Client Domain Utils', () => {
  let store;
  let content;
  let t;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    content = store.getState().settings.get('language');
    t = key => {
      return content[`Engagement_${key}`];
    };
    store.clearActions();
  });

  it('Validate should return true', () => {
    expect(validate('abc.com')).toEqual(true);
  });

  it('Validate should return false', () => {
    expect(validate('abc')).toEqual(false);
  });

  it('should not get error', () => {
    const client = { domains: ['abc.com'] };
    expect(getErrors(FormErrorModel, 'test.com', t, client)).toEqual({ domainName: null });
  });

  it('should get error for invalid domain', () => {
    const client = { domains: ['abc.com'] };
    expect(getErrors(FormErrorModel, 'test', t, client)).toEqual({
      domainName: 'Enter domain name (e.g. company.com)',
    });
  });

  it('should get error for @ in domain', () => {
    const client = { domains: ['abc.com'] };
    expect(getErrors(FormErrorModel, 'test@.com', t, client)).toEqual({
      domainName: 'Please indicate the domain name only (e.g. company.com)',
    });
  });

  it('should get error for existing domain', () => {
    const client = { domains: ['abc.com', 'test@.com'] };
    expect(getErrors(FormErrorModel, 'test@.com', t, client)).toEqual({
      domainName: 'Domain name already exists',
    });
  });

  it('Should render first column', () => {
    jest.spyOn(getTableHeaders(content)[0], 'render');
    const isRendering = shallow(getTableHeaders(content)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render second column', () => {
    jest.spyOn(getTableHeaders(content)[1], 'render');
    const isRendering = shallow(getTableHeaders(content)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
