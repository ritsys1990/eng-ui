export const mockedNodeData = {
  1111: {
    id: '1111',
    name: 'sourceSystem1',
    level: 0,
    typeOfNode: 1,
    nodes: {
      2222: {
        id: '2222',
        name: 'sourceVersion1',
        level: 1,
        typeOfNode: 1,
        nodes: {
          3333: {
            id: '3333',
            name: 'bundle1',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '1111',
            sourceSystemName: 'sourceSystem1',
            sourceVersionId: '2222',
            sourceVersionName: 'sourceVersion1',
          },
          4444: {
            id: '4444',
            name: 'bundle2',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '1111',
            sourceSystemName: 'sourceSystem1',
            sourceVersionId: '2222',
            sourceVersionName: 'sourceVersion1',
          },
        },
      },
      5555: {
        id: '5555',
        name: 'sourceVersion2',
        level: 1,
        typeOfNode: 1,
        nodes: {
          6666: {
            id: '6666',
            name: 'bundle11',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '1111',
            sourceSystemName: 'sourceSystem1',
            sourceVersionId: '5555',
            sourceVersionName: 'sourceVersion2',
          },
          7777: {
            id: '7777',
            name: 'bundle22',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '1111',
            sourceSystemName: 'sourceSystem2',
            sourceVersionId: '5555',
            sourceVersionName: 'sourceVersion1',
          },
        },
      },
    },
  },
  8888: {
    id: '8888',
    name: 'sourceSystem8888',
    level: 0,
    typeOfNode: 1,
    nodes: {
      9999: {
        id: '9999',
        name: 'sourceVersion9999',
        level: 1,
        typeOfNode: 1,
        nodes: {
          1010: {
            id: '1010',
            name: 'bundle1010',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '8888',
            sourceSystemName: 'sourceSystem8888',
            sourceVersionId: '9999',
            sourceVersionName: 'sourceVersion9999',
          },
          1111: {
            id: '1111',
            name: 'bundle1111',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '8888',
            sourceSystemName: 'sourceSystem8888',
            sourceVersionId: '9999',
            sourceVersionName: 'sourceVersion9999',
          },
        },
      },
      1212: {
        id: '1212',
        name: 'sourceVersion1212',
        level: 1,
        typeOfNode: 1,
        nodes: {
          1313: {
            id: '1313',
            name: 'bundle1313',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '8888',
            sourceSystemName: 'sourceSystem8888',
            sourceVersionId: '1212',
            sourceVersionName: 'sourceVersion1212',
          },
          1414: {
            id: '1414',
            name: 'bundle1414',
            level: 2,
            typeOfNode: 0,
            parentId: '0000',
            sourceSystemId: '8888',
            sourceSystemName: 'sourceSystem8888',
            sourceVersionId: '1212',
            sourceVersionName: 'sourceVersion1212',
          },
        },
      },
    },
  },
};