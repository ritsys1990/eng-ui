const mockParentId = '421ce16c-5262-419a-9e09-d70d2cd0d661';
const mockTimestamp = '2020-06-12T10:43:42.811Z';
const mockUserEmail = 'dhshinde@deloitte.com';

export const publishedDMs = {
  items: [
    {
      fields: [
        {
          id: '5a83be6a-c485-4eeb-b78e-1bf7d6627b17',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'ORGANIZATION_ID',
          nameNonTech: 'ORGANIZATION_ID',
          description: 'Test',
          type: 'VarChar',
          isMandatory: true,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: '3b26ad34-08c7-4bfc-a1ce-343d999a8b7a',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'STYLE_ITEM_ID',
          nameNonTech: 'STYLE_ITEM_ID',
          description: 'test',
          type: 'VarChar',
          isMandatory: true,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: 'b107ad23-9048-4d14-8c43-71d3f5a01ae7',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'CONCATENATED_VA_SEGMENTS',
          nameNonTech: 'CONCATENATED_VA_SEGMENTS',
          description: 'test',
          type: 'Text',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: '8e19c596-62bc-4ad8-88a1-1516a6d37447',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'SKU_ITEM_ID',
          nameNonTech: 'SKU_ITEM_ID',
          description: 'test',
          type: 'Numeric',
          isMandatory: true,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: 'b0b99949-ec41-4ab3-9bd6-46553be568ba',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'LAST_UPDATE_LOGIN',
          nameNonTech: 'LAST_UPDATE_LOGIN',
          description: 'test',
          type: 'Int',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: 'c7250c98-4996-4782-af6b-bd00e25c8720',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'CREATION_DATE',
          nameNonTech: 'CREATION_DATE',
          description: 'test',
          type: 'Int',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: 'a0266921-1951-4f9f-acc5-d281d5fcf21b',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'CREATED_BY',
          nameNonTech: 'CREATED_BY',
          description: 'test',
          type: 'Numeric',
          isMandatory: true,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: '57bbdc75-8db2-4297-bebd-9f856ae44042',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'LAST_UPDATE_DATE',
          nameNonTech: 'LAST_UPDATE_DATE',
          description: 'test',
          type: 'Float',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: 'd4fe3a56-b626-42a5-bde7-1b23ed779cee',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'LAST_UPDATED_BY',
          nameNonTech: 'LAST_UPDATED_BY',
          description: 'test',
          type: 'Numeric',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
        {
          id: '05566c50-4e04-44f5-b678-5ae408022091',
          parentId: mockParentId,
          lastUpdated: mockTimestamp,
          lastUpdatedBy: mockUserEmail,
          nameTech: 'CORTEX_EVENT_ID',
          nameNonTech: 'CORTEX_EVENT_ID',
          description: 'test',
          type: 'Float',
          isMandatory: false,
          isKey: false,
          dataFormat: null,
          tagIds: [],
        },
      ],
      id: mockParentId,
      parentId: 'de5c57b1-d3f3-42be-9737-35e1b2164b42',
      lastUpdated: '2020-10-27T13:58:56.946Z',
      lastUpdatedBy: mockUserEmail,
      currentState: {
        version: 2,
        revision: 4,
        publishState: 'Published',
        timestamp: '2020-10-27T13:58:48.815Z',
        createdBy: mockUserEmail,
        comment: null,
        sourceEnv: null,
        sourceEnvVersion: 0,
      },
      stateHistory: [
        {
          version: 1,
          revision: 3,
          publishState: 'Deactivated',
          timestamp: '2020-10-27T13:58:42.939Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 1,
          revision: 2,
          publishState: 'Published',
          timestamp: '2020-06-12T11:29:01.764Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 1,
          publishState: 'ReadyForReview',
          timestamp: '2020-06-12T11:28:47.949Z',
          createdBy: mockUserEmail,
          comment: 'test',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 0,
          publishState: 'Draft',
          timestamp: mockTimestamp,
          createdBy: mockUserEmail,
          comment: 'Initial version was created.',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 2,
          revision: 7,
          publishState: 'ReadyForReview',
          timestamp: '2020-03-13T09:17:36.426Z',
          createdBy: mockUserEmail,
          comment: 'test',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 2,
          revision: 6,
          publishState: 'Draft',
          timestamp: '2020-03-13T09:16:50.049Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 2,
          revision: 5,
          publishState: 'Published',
          timestamp: '2020-03-11T06:51:58.079Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 1,
          revision: 4,
          publishState: 'ReadyForReview',
          timestamp: '2020-03-11T06:50:40.972Z',
          createdBy: mockUserEmail,
          comment: 'test',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 1,
          revision: 3,
          publishState: 'Draft',
          timestamp: '2020-03-11T06:47:16.085Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 1,
          revision: 2,
          publishState: 'Published',
          timestamp: '2020-02-17T11:58:44.156Z',
          createdBy: mockUserEmail,
          comment: null,
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 1,
          publishState: 'ReadyForReview',
          timestamp: '2020-02-17T11:58:27.312Z',
          createdBy: mockUserEmail,
          comment: 'test',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
        {
          version: 0,
          revision: 0,
          publishState: 'Draft',
          timestamp: '2020-02-17T11:49:25.877Z',
          createdBy: mockUserEmail,
          comment: 'Initial version was created.',
          sourceEnv: null,
          sourceEnvVersion: 0,
        },
      ],
      chainId: mockParentId,
      isLatest: true,
      tagIds: ['194d03a9-ba44-4ce4-9ca9-1a3d35e62da5'],
      bundleBaseId: 'de5c57b1-d3f3-42be-9737-35e1b2164b42',
      nameTech: 'AutoMapTest',
      nameNonTech: 'Automap',
      description: 'test',
      engagementId: null,
      sampleDataSetNodeId: null,
      generalInstructions: null,
    },
  ],
};
