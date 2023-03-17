export function getOutputs() {
  return {
    workpaperId: '3e16f820-fad4-49f4-963b-edead4ad9e86',
    name: 'Book1 – 2.csv',
    sourceType: 'trifacta',
    sourceName: 'Book1___2_csv.csv',
    trifactaOutputId: '761',
    engagementId: 'af2c60d2-fa8e-46cf-8736-16101d67221f',
    status: 'finished',
    nodeId: '5efe20762c3dbf5c588e9ac7',
    id: '4ad86091-5216-4cab-8486-b16299cade9a',
    dataSetName: 'save check test55123',
    nodePath:
      '/dev/cortex/filesystem/US/e67dc025-6b17-4926-b19d-65edc6427d44___makecortexprettyagain/Engagement/Carlos_/Workitems/OptimizeSync_3e16f820-fad4-49f4-963b-edead4ad9e86/StructuredTables/Book1___2_csv.csv',
  };
}

export function getOutputSchema() {
  return [
    {
      name: 'Description',
    },
    {
      name: 'Type_____',
    },
    {
      name: 'Taken_to_sprint_',
    },
    {
      name: 'Suggestion',
    },
    {
      name: 'Navigation_',
    },
    {
      name: 'ScreeShot1',
    },
    {
      name: 'ScreeShot2',
    },
  ];
}

export function getOutputLabelError() {
  return new Error('User defined outputLabel Error');
}

export function getOutputsLabelsList() {
  return ['DQC', 'NO SQL'];
}
