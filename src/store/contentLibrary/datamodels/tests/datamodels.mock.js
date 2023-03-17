const mockDatamodelParentId = '42823f15-6af3-416c-8026-6a5a8468a051';
const mockUserEmail = 'tsekharamahanti@deloitte.com';
const mockComment = 'Initial version was created.';
const mockTagParentId = '15ff661d-dfb7-4b3a-abe9-1dba5b675ca1';
const mockTimestamp = '2020-11-03T07:42:55.413Z';

export const datamodelsMock = {
  datamodels: {
    items: [
      {
        fields: [
          {
            aliases: ['alias1', 'alias2'],
            id: 'e17bae59-d55e-4e25-a0e0-660636ac6e6b',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:23:58.933Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column1',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['Column1', 'Test_DM_TK'],
            id: '2c75caec-2fb5-4655-82c3-5df8ac4b7c68',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:08.388Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column2',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['alias1', 'alias2'],
            id: '282f2028-c9e2-4a2c-8945-825fd4d1011f',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:20.025Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column3',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['Test_DM_TK', 'alias2'],
            id: 'c743a8b8-4d85-498c-9533-1590c59ac727',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:28.399Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column4',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
        ],
        id: 'e5c676e3-e22e-4807-b0f6-4142eca18cc4',
        parentId: mockDatamodelParentId,
        lastUpdated: '2020-11-06T12:51:18.193Z',
        lastUpdatedBy: mockUserEmail,
        fromEnvironment: ['dev'],
        currentState: {
          version: 2,
          revision: 5,
          publishState: 'Published',
          timestamp: '2020-11-03T10:59:11.605Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        stateHistory: [
          {
            version: 1,
            revision: 4,
            publishState: 'ReadyForReview',
            timestamp: '2020-11-03T10:58:50.422Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 1,
            revision: 3,
            publishState: 'Draft',
            timestamp: '2020-11-03T10:58:00.431Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 1,
            revision: 2,
            publishState: 'Published',
            timestamp: '2020-10-30T12:28:28.11Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 0,
            revision: 1,
            publishState: 'ReadyForReview',
            timestamp: '2020-10-30T12:28:10.897Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 0,
            revision: 0,
            publishState: 'Draft',
            timestamp: '2020-10-30T12:23:38.81Z',
            createdBy: mockUserEmail,
            comment: mockComment,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
        ],
        chainId: mockDatamodelParentId,
        isLatest: true,
        tableAlias: ['myAlias1'],
        tagIds: ['a5424f4d-e025-4a53-9941-a53b0a20130f'],
        bundleBaseId: mockDatamodelParentId,
        nameTech: 'Test_DM_TK',
        dmName: 'Test_DM_TK',
        nameNonTech: '',
        description: '',
        engagementId: null,
        sampleDataSetNodeId: '5fa546c53f8ab70006d5f4a4',
        generalInstructions: null,
        cdmId: 'a5424f4d-e025-4a53-9941-a53b0a20176r',
      },
      {
        fields: [
          {
            aliases: ['alias1', 'alias2'],
            id: 'e17bae59-d55e-4e25-a0e0-660636ac6123',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:23:58.933Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column1',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['alias1', 'alias2'],
            id: '2c75caec-2fb5-4655-82c3-5df8ac4b7212121',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:08.388Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column2',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['alias1', 'alias2'],
            id: '282f2028-c9e2-4a2c-8945-825fd4d1011f',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:20.025Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column3',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
          {
            aliases: ['alias1', 'alias2'],
            id: 'c743a8b8-4d85-498c-9533-1590c59ac727',
            parentId: mockDatamodelParentId,
            lastUpdated: '2020-10-30T12:24:28.399Z',
            lastUpdatedBy: mockUserEmail,
            nameTech: 'Column4',
            nameNonTech: '',
            description: '',
            type: 'Text',
            isMandatory: false,
            isKey: false,
            dataFormat: null,
            tagIds: [],
          },
        ],
        id: 'e5c676e3-e22e-4807-b0f6-4142eca1212121',
        parentId: mockDatamodelParentId,
        lastUpdated: '2020-11-06T12:51:18.193Z',
        lastUpdatedBy: mockUserEmail,
        currentState: {
          version: 2,
          revision: 5,
          publishState: 'Published',
          timestamp: '2020-11-03T10:59:11.605Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        stateHistory: [
          {
            version: 1,
            revision: 4,
            publishState: 'ReadyForReview',
            timestamp: '2020-11-03T10:58:50.422Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 1,
            revision: 3,
            publishState: 'Draft',
            timestamp: '2020-11-03T10:58:00.431Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 1,
            revision: 2,
            publishState: 'Published',
            timestamp: '2020-10-30T12:28:28.11Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 0,
            revision: 1,
            publishState: 'ReadyForReview',
            timestamp: '2020-10-30T12:28:10.897Z',
            createdBy: mockUserEmail,
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
          {
            version: 0,
            revision: 0,
            publishState: 'Draft',
            timestamp: '2020-10-30T12:23:38.81Z',
            createdBy: mockUserEmail,
            comment: mockComment,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
        ],
        chainId: mockDatamodelParentId,
        isLatest: true,
        tableAlias: ['Alias1'],
        tagIds: [],
        bundleBaseId: mockDatamodelParentId,
        nameTech: 'Test_DM_TK',
        nameNonTech: '',
        description: '',
        engagementId: null,
        sampleDataSetNodeId: '5fa546c53f8ab70006d5f4a4',
        generalInstructions: null,
      },
    ],
  },
};

export const fieldTypes = [
  { code: 'Text', displayName: 'text' },
  { code: 'Char', displayName: 'char' },
  { code: 'Numeric', displayName: 'numeric' },
  { code: 'Bool', displayName: 'bool' },
];

export const tags = {
  items: [
    {
      tags: [
        {
          id: 'a5424f4d-e025-4a53-9941-a53b0a20130f',
          parentId: mockTagParentId,
          lastUpdated: '2019-01-17T14:21:01.988Z',
          lastUpdatedBy: mockUserEmail,
          name: 'While',
          description: '',
        },
      ],
      id: mockTagParentId,
      parentId: null,
      lastUpdated: '2019-01-17T14:21:26.65Z',
      lastUpdatedBy: mockUserEmail,
      currentState: {
        version: 1,
        revision: 2,
        publishState: 'Published',
        timestamp: '2019-01-17T14:21:26.648Z',
        createdBy: mockUserEmail,
        comment: null,
        sourceEnv: null,
        sourceEnvVersion: 0,
      },
      stateHistory: [
        {
          version: 0,
          revision: 1,
          publishState: 'ReadyForReview',
          timestamp: '2019-01-17T14:21:13.066Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 0,
          publishState: 'Draft',
          timestamp: '2019-01-17T14:20:53.339Z',
          createdBy: mockUserEmail,
          comment: mockComment,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
      ],
      chainId: mockTagParentId,
      isLatest: true,
      name: '0117',
      description: 'True',
      color: null,
    },
    {
      tags: [
        {
          id: '0f02be02-fea2-4fd0-8c3f-d5d7a43e508b',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:38.184Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Receivables',
          description: '',
        },
        {
          id: '5a609213-da5c-45e3-a5c7-76a44728c2ca',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:40.553Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Self-Insurance Liabilities',
          description: '',
        },
        {
          id: '7e16bbec-87f2-4994-8e80-9d5716a583ca',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:39.746Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Deposits',
          description: '',
        },
        {
          id: '860de154-d583-432e-b109-6507aaea7fbc',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:38.958Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Reserves',
          description: '',
        },
        {
          id: '8fdd48f8-fc8c-422f-83d2-fa1a50c625d8',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:35.973Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Operating Expenses',
          description: '',
        },
        {
          id: '9a09bc3a-046d-4ed7-8fe2-629b10ecb3f9',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:41.322Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Investments',
          description: '',
        },
        {
          id: 'a1fda4f8-7a8f-4fe7-8323-374592ae911a',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:42.04Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Revenue',
          description: '',
        },
        {
          id: 'c24db367-3693-47cc-af6d-fba734e4455f',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:37.46Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Property, Plant & Equipment',
          description: '',
        },
        {
          id: 'cdd35fc0-cb46-40f0-a6a9-96db69747efe',
          parentId: mockTagParentId,
          lastUpdated: '2019-11-13T12:41:36.747Z',
          lastUpdatedBy: mockUserEmail,
          name: 'Debt',
          description: '',
        },
      ],
      id: mockTagParentId,
      parentId: null,
      lastUpdated: '2019-11-13T12:42:03.267Z',
      lastUpdatedBy: mockUserEmail,
      currentState: {
        version: 1,
        revision: 2,
        publishState: 'Published',
        timestamp: '2019-11-13T12:42:02.401Z',
        createdBy: mockUserEmail,
        comment: null,
        sourceEnv: null,
        sourceEnvVersion: 0,
      },
      stateHistory: [
        {
          version: 0,
          revision: 1,
          publishState: 'ReadyForReview',
          timestamp: '2019-11-13T12:41:53.64Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 0,
          publishState: 'Draft',
          timestamp: '2019-11-13T12:41:33.618Z',
          createdBy: mockUserEmail,
          comment: mockComment,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
      ],
      chainId: mockTagParentId,
      isLatest: true,
      name: 'Account Balance',
      description: '',
      color: null,
    },
  ],
};

export const dmtsList = [
  {
    id: '5a4be764-fec7-4b9c-90a0-68d21a64abd8',
    chainId: null,
    clientIds: null,
    isLatest: null,
    name: 'Test_TK_123',
    description: null,
    workpaperSource: 'Cortex',
    url: null,
    engagementId: null,
    templateId: null,
    templateName: null,
    workBookId: null,
    hostWorkpaperId: null,
    configurationFileString: null,
    additionalComment: null,
    reasonOfRejection: null,
    containerId: '0',
    containerCode: '00',
    countryCode: '00',
    geoCode: 'AME',
    memberFirmCode: '00',
    trifactaFlowId: 0,
    bundleTransformation: false,
    status: 'Draft',
    lastUpdated: mockTimestamp,
    lastUpdatedBy: mockUserEmail,
    createdBy: mockUserEmail,
    creationDate: mockTimestamp,
    tagIds: [],
    order: null,
    versionNumber: 1,
    tableauProjectId: null,
    sourceEnv: null,
    sourceEnvVersion: 0,
    reviewStatus: null,
    statusHistory: null,
    source: ['fb77ef07-a077-4fd1-94a2-5d8e4ed904f4'],
    isDMT: true,
    outputs: ['fb77ef07-a077-4fd1-94a2-5d8e4ed904f4', 'fb77ef07-a077-4fd1-94a2-5d8e4ed901234'],
  },
  {
    id: '5a4be764-fec7-4b9c-90a0-68d21a64aabc',
    chainId: null,
    clientIds: null,
    isLatest: null,
    name: 'Test_TK_123',
    description: null,
    workpaperSource: 'Cortex',
    url: null,
    engagementId: null,
    templateId: null,
    templateName: null,
    workBookId: null,
    hostWorkpaperId: null,
    configurationFileString: null,
    additionalComment: null,
    reasonOfRejection: null,
    containerId: '0',
    containerCode: '00',
    countryCode: '00',
    geoCode: 'AME',
    memberFirmCode: '00',
    trifactaFlowId: 0,
    bundleTransformation: false,
    status: 'Draft',
    lastUpdated: mockTimestamp,
    lastUpdatedBy: mockUserEmail,
    createdBy: mockUserEmail,
    creationDate: mockTimestamp,
    tagIds: [],
    order: null,
    versionNumber: 1,
    tableauProjectId: null,
    sourceEnv: null,
    sourceEnvVersion: 0,
    reviewStatus: null,
    statusHistory: null,
    source: [],
    isDMT: true,
    outputs: [],
  },
];

export const dmMappingMock = [
  { name: 'verifyFields01', mappingType: 'Workpaper', type: 'to' },
  { name: 'verifyFields02', mappingType: 'Workpaper', type: 'from' },
];

export const allEnvironmentsMock = [{ name: 'qas1' }, { name: 'qas' }, { name: 'dev1' }];

export const environmentContentMock = [{ name: 'dm1' }, { name: 'dm2' }];

export const alertErrors = [{ type: 'error', message: 'some Random Error1', key: 1 }];

export const datamodelMock = { name: 'datamodel1' };

export const dmtsMock = [
  {
    id: 'b65eade2-d2e8-4e95-9645-601448e45919',
    name: 'TK_DM_Test_Ingest_DMT',
    workpaperSource: 'Trifacta',
    outputs: ['732873297319864'],
  },
];

export const dmtsIngestionMock = [
  {
    id: '732873297319864',
    name: 'Test new DMT Ingest Status',
    status: 'Success',
    fromEnv: 'dev1',
    errorMessage:
      'dsadsgdfhsgfhsvjhsdfgsdklfgskaldgskdgskjfgskjfgsdkjfkjfgjfgwfhwkjefgweufgwiyfckjwcvfdsgchgvdksjudfkjdckdjhcvdshjvejvejfvekvfeverfvhriuhwfguweidfweufdvweiufweiyfgweiufuiewf3iufgweiufgwjfvweiugfwevfuiewgyfwevfiwelyfgidvhweigfevfuyfgwedvcwjhcgasihxscisucdiygiudgidfgiewyyfgwyevfdwehfvw',
    type: 1,
    lastUpdatedAt: '2021-09-30T16:26:45.593Z',
  },
  {
    id: '732873297319865',
    name: 'Test new DMT Ingest Status 2',
    status: 'ValidationFailed',
    fromEnv: 'dev1',
    errorMessage:
      'dsadsgdfhsgfhsvjhsdfgsdklfgskaldgskdgskjfgskjfgsdkjfkjfgjfgwfhwkjefgweufgwiyfckjwcvfdsgchgvdksjudfkjdckdjhcvdshjvejvejfvekvfeverfvhriuhwfguweidfweufdvweiufweiyfgweiufuiewf3iufgweiufgwjfvweiugfwevfuiewgyfwevfiwelyfgidvhweigfevfuyfgwedvcwjhcgasihxscisucdiygiudgidfgiewyyfgwyevfdwehfvw',
    type: 0,
    lastUpdatedAt: '2021-09-30T17:26:45.593Z',
  },
  {
    id: '732873297319866',
    name: 'Test new DMT Ingest Status 3',
    status: '',
    fromEnv: 'dev1',
    errorMessage:
      'dsadsgdfhsgfhsvjhsdfgsdklfgskaldgskdgskjfgskjfgsdkjfkjfgjfgwfhwkjefgweufgwiyfckjwcvfdsgchgvdksjudfkjdckdjhcvdshjvejvejfvekvfeverfvhriuhwfguweidfweufdvweiufweiyfgweiufuiewf3iufgweiufgwjfvweiugfwevfuiewgyfwevfiwelyfgidvhweigfevfuyfgwedvcwjhcgasihxscisucdiygiudgidfgiewyyfgwyevfdwehfvw',
    type: 0,
    lastUpdatedAt: '2021-09-30T18:26:45.593Z',
  },
];
