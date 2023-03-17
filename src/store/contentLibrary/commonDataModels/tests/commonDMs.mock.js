export const commonDMsMock = [
  {
    id: 'e5c676e3-e22e-4807-b0f6-4142eca18cc5',
    name: 'Test Common Data Model',
    description: 'Test CDM Description',
    lastUpdated: '2021-11-22T13:37:39.253Z',
  },
  {
    id: 'e5c676e3-e22e-4807-b0f6-4142eca18cc6',
    name: 'Test Common Data Model 2',
    description: 'Test CDM Description',
    lastUpdated: '2021-12-22T13:37:39.253Z',
  },
];

export const datamodelsMock = [
  {
    id: 'e5c676e3-e22e-4807-b0f6-4142eca18cc4',
    lastUpdated: '2020-11-06T12:51:18.193Z',
    currentState: {
      version: 2,
      revision: 5,
      publishState: 'Published',
      timestamp: '2020-11-03T10:59:11.605Z',
      comment: null,
      sourceEnv: null,
      sourceEnvVersion: 0,
    },
    stateHistory: [
      {
        version: 0,
        revision: 0,
        publishState: 'Draft',
        timestamp: '2020-10-30T12:23:38.81Z',
        sourceEnv: null,
        sourceEnvVersion: 0,
      },
    ],
    chainId: '42823f15-6af3-416c-8026-6a5a8468a051',
    isLatest: true,
    tagIds: ['a5424f4d-e025-4a53-9941-a53b0a20130f'],
    bundleBaseId: '42823f15-6af3-416c-8026-6a5a8468a051',
    nameTech: 'Test_DM_TK',
    nameNonTech: '',
    tableAlias: ['Demo'],
    description: '',
    engagementId: null,
    sampleDataSetNodeId: '5fa546c53f8ab70006d5f4a4',
    generalInstructions: null,
  },
];

export const cdmsMapMock = new Map([['e5c676e3-e22e-4807-b0f6-4142eca18cc5', 'Test Common Data Model']]);
