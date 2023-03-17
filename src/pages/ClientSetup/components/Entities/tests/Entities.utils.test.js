import {
  getAllEntitiesTableHeaders,
  getActiveEntitiesTableHeaders,
  getAllEntitiesContextMenuOptions,
} from '../utils/Entities.utils';
import { shallow } from 'enzyme';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { TRANSLATION_KEY_ALL_ENTITIES } from '../constants/constants';

const row = {
  id: '12345',
  isFromMat: false,
  matEntityId: 1234,
  name: 'Entity 1',
  subOrgId: '0000AA',
  engagementNames: ['Engagement 1'],
};

describe('getAllEntitiesTableHeaders', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should render first column', () => {
    const isRendering = shallow(getAllEntitiesTableHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render second column', () => {
    const isRendering = shallow(getAllEntitiesTableHeaders(t)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render third column', () => {
    const isRendering = shallow(
      getAllEntitiesTableHeaders(t)[2].render(123, { ...row, canEdit: true, canDelete: true })
    );
    expect(isRendering.length).toBe(1);
  });

  it('Should call second parameter on button click', () => {
    const mockFn = jest.fn().mockImplementation(() => {});

    const isRendering = shallow(
      getAllEntitiesTableHeaders(t, mockFn)[2].render(123, { ...row, canEdit: true, canDelete: true })
    );
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, `${TRANSLATION_KEY_ALL_ENTITIES}-Context`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')('Test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('getActiveEntitiesTableHeaders', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should render first column', () => {
    const isRendering = shallow(getActiveEntitiesTableHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render second column', () => {
    const isRendering = shallow(getActiveEntitiesTableHeaders(t)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render third column', () => {
    const isRendering = shallow(getActiveEntitiesTableHeaders(t)[2].render(123, row));
    expect(isRendering.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('getAllEntitiesContextMenuOptions', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should return 2 options', () => {
    const options = getAllEntitiesContextMenuOptions(t, { canEdit: true, canDelete: true });
    expect(options.length).toBe(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
