import {
  getOrgHeaders,
  getOrgRows,
  getSubOrgHeaders,
  getAgentHeaders,
  getSubOrgContextMenuOptions,
} from '../utils/utils';
import { shallow } from 'enzyme';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';

const legacyUtilsMock = jest.requireMock('../../../../../utils/legacyUtils');

const row = {
  name: 'Test',
  orgUUID: 1001,
  orgId: 1123,
  installToken: {
    test: 'test',
  },
  active: true,
  readyToRun: false,
};

const orgDetails = {
  orgId: 1123,
  name: 'test',
  orgUUID: 2123,
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

describe('Entities.util', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should render first column', () => {
    const isRendering = shallow(getOrgHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render second column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});

    const isRendering = shallow(getOrgHeaders(t, mockFn, mockFn, mockFn)[1].render(123, row));
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, 'SubOrg-Setup_Copy', 'Button');
    button.invoke('onClick')('Test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('Should render third column', () => {
    const isRendering = shallow(getOrgHeaders(t)[2].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render Entities fourth column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const clientPermissions = {
      orgs: {
        delete: true,
      },
    };

    const isRendering = shallow(getOrgHeaders(t, clientPermissions, mockFn)[3].render(123, row));
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, 'SubOrg-Setup_Delete', 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')('Test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('Add Entities should return null', () => {
    expect(getOrgRows(orgDetails)).toEqual([
      {
        orgId: 1123,
        name: 'test',
        orgUUID: 2123,
      },
    ]);
  });

  it('Should render subOrg first column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render subOrg second column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render subOrg third column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[2].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render subOrg fifth column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[4].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render subOrg sixth column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[5].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render subOrg seventh column', () => {
    const isRendering = shallow(getSubOrgHeaders(t)[6].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render Entities eigth column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});

    const isRendering = shallow(getSubOrgHeaders(t, mockFn, mockFn, mockFn, mockFn)[7].render(123, row));
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, 'SubOrg-Setup-Context', 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')('Test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('Should render agents first column', () => {
    const isRendering = shallow(getAgentHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render agents second column', () => {
    const isRendering = shallow(getAgentHeaders(t)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render agents third column', () => {
    const isRendering = shallow(getAgentHeaders(t)[2].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render agents fourth column', () => {
    const isRendering = shallow(getAgentHeaders(t)[3].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render agents fifth column', () => {
    const isRendering = shallow(getAgentHeaders(t)[4].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render agents sixth column', () => {
    const isRendering = shallow(getAgentHeaders(t)[5].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should return 3 options for context menu', () => {
    const permissions = { suborgs: { update: true, delete: true } };
    const result = getSubOrgContextMenuOptions(t, { installToken: true }, permissions);
    expect(result.length).toBe(3);
  });

  it('Should not render Entities fourth column for Legacy portal', () => {
    legacyUtilsMock.isLegacyMode = true;
    const mockFn = jest.fn().mockImplementation(() => {});
    const clientPermissions = {
      orgs: {
        delete: true,
      },
    };
    const isRendering = shallow(getOrgHeaders(t, clientPermissions, mockFn)[3].render(123, row));
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, 'SubOrg-Setup-Delete', 'Button');
    expect(button.length).toBe(0);
    legacyUtilsMock.isLegacyMode = false;
  });

  afterEach(() => {
    jest.clearAllMocks(t);
  });
});
