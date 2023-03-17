export function getWpDetailsMock() {
  return {
    id: 'ae438568-00b2-4270-8bb8-acb8e71bddec',
    chainId: null,
    clientIds: null,
    isLatest: null,
    name: 'WP-2006',
    description: null,
    url:
      'https://deloittenet.deloitte.com/PC/PracticeComm/functions/AERS/AERSAudit/Innovation/AuditAnalyticsLibrary/Pages/AuditAnalytics_Loan_Receivable_Analysis.aspx',
    engagementId: 'd132c7b9-7221-4780-a60b-6b84ed61710e',
    templateId: 'f0bdb962-fa35-454a-b74a-626879ecfe8e',
    workBookId: null,
    hostWorkpaperId: null,
    configurationFileString: null,
    additionalComment: null,
    reasonOfRejection: null,
    containerId: null,
    containerCode: null,
    countryCode: null,
    geoCode: null,
    memberFirmCode: null,
    bundleTransformation: false,
    status: 'Draft',
    lastUpdated: '2020-04-28T20:33:13.658Z',
    lastUpdatedBy: 'vdevarajan@deloitte.com',
    createdBy: 'vdevarajan@deloitte.com',
    creationDate: null,
    tagIds: [],
    order: null,
    versionNumber: 1,
    tableauProjectId: null,
    outputUrl: null,
    outputFileName: null,
    outputType: null,
    outputId: null,
    fileNodeId: null,
    reviewStatus: null,
    isJEWorkpaper: false,
  };
}

export function getWpTemplateMock() {
  return {
    id: 'f0bdb962-fa35-454a-b74a-626879ecfe8e',
    chainId: '8e953276-0686-46e8-ac59-70500b81bee3',
    clientIds: null,
    isLatest: true,
    name: '0121',
    description: null,
    url:
      'https://deloittenet.deloitte.com/PC/PracticeComm/functions/AERS/AERSAudit/Innovation/AuditAnalyticsLibrary/Pages/AuditAnalytics_Loan_Receivable_Analysis.aspx',
    engagementId: null,
    templateId: null,
    workBookId: null,
    hostWorkpaperId: null,
    configurationFileString: null,
    additionalComment: '',
    reasonOfRejection: null,
    containerId: null,
    containerCode: null,
    countryCode: null,
    geoCode: null,
    memberFirmCode: null,
    bundleTransformation: false,
    status: 'Published',
    lastUpdated: '2020-03-06T11:54:41.016Z',
    lastUpdatedBy: 'msriteja@deloitte.com',
    createdBy: 'bhcheruku@deloitte.com',
    creationDate: null,
    tagIds: [],
    order: null,
    versionNumber: 1,
    tableauProjectId: null,
    outputUrl: null,
    outputFileName: null,
    outputType: null,
    outputId: null,
    fileNodeId: null,
    reviewStatus: null,
    isJEWorkpaper: false,
  };
}

export function getWpStatusMock() {
  return { batchMode: false, status: 'error', progress: {}, waitingJRStepId: '' };
}

export function actionEngagementCloseoutMock() {
  return 'Approved';
}

export function publishedEngagementCloseoutMock() {
  return ['Approved', 'PendingApproval'];
}
