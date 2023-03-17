import BaseService from './baseService';
import env from 'env';
import { ContentTypes } from './constants/constants';

class StagingService extends BaseService {
  // name = 'Staging Service';

  getUrl(path) {
    return `/staging-service/${path}`;
  }

  getUrlProxy(path) {
    return `/proxy/staging-service/${path}`;
  }

  getFilePath(nodeId) {
    return this.makeRequest(`/staging/storage/nodepath/${nodeId}`);
  }

  async getTempLink(filePath) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: { item: filePath },
    };

    return this.makeRequest('/download/raw', options, true);
  }

  async stagingGetFileDL(filepath) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: { item: filepath },
      responseType: 'arraybuffer',
    };

    return this.makeRequest('/staging/storage/download', options);
  }

  async downloadFileFromPath(path) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        item: path,
      },
    };

    const file = await this.makeRequest('/staging/storage/download', options);

    return file.blob();
  }

  async storageDownloadFile(id, zip = '', fileName = '') {
    const urlZip = zip ? 'mode=zip' : '';
    const fileNameZip = fileName ? `downloadFileName=${fileName}` : '';
    const urlQuery = zip && fileNameZip ? `${urlZip}&${fileNameZip}` : `${urlZip}+${fileNameZip}`;
    const queryParam = urlQuery ? `?${urlQuery}` : '';
    const a = document.createElement('a');
    a.href = `${env.ANALYTICSUI_URL}${this.getUrlProxy(`download/${id}`) + queryParam}`;
    a.setAttribute('target', '_blank');
    a.click();
  }

  async storageDownloadAllOutputFiles(list, name, outputType = 'DQC') {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: list,
      responseType: 'arraybuffer',
    };

    const file = await this.makeRequest('/download/DownloadDQCfiles', options, true);
    const blob = new Blob([file], {
      type: 'application/octet-stream',
    });
    // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
    const a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    // Create a DOMString representing the blob and point the link element towards it
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${name}_${outputType}.zip`;
    // programatically click the link to trigger the download
    a.click();
    // release the reference to the file by revoking the Object URL
    window.URL.revokeObjectURL(url);
  }

  async getRootFolder(engagementId, clientId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/staging/storage/explorer/engagement/${engagementId}/client/${clientId}`, options);
  }

  async getChildrenFolder(engagementId, folderId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(
      `/staging/storage/explorer/engagement/${engagementId}/childrenwithproperties/${folderId}`,
      options
    );
  }

  async getEngagementFolders(clientId, engagementId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/cortex/${clientId}/userimporteddatafolders/${engagementId}`, options);
  }

  async validateZipFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest('staging/storage/zipFileValidation', options);
  }

  async ensureFolder(id, folderName = 'dmv') {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': ContentTypes.APPLICATION_JSON },
      data: JSON.stringify({ item: `${folderName}/${id}` }),
    };

    return this.makeRequest(
      `/cortex/0000-client/userimporteddata/0000-engagement/create/returnpathandnode?isDummyClient=true&overwrite=true`,
      options,
      true
    );
  }

  async generateDMUploadLink(file, bundleNodeObjNodeId, fileFormat = 'CSV', isRoot = false, fileType = 'RAW') {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: formData,
    };

    return this.makeRequest(
      `/staging/storage/filenode?ParentId=${bundleNodeObjNodeId}&FileType=${fileType}&FileFormat=${fileFormat}&IsRoot=${isRoot}&Bypass=true&dmvUpload=true`,
      options
    );
  }

  async getNodeInfo(nodeId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/staging/storage/nodeinfo/${nodeId}`, options);
  }

  async checkFileSize(dataLakePath) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/staging/storage/getFileSizeByPath?filePath=${dataLakePath}`, options);
  }

  async triggerWorkpaperDecryption(workpaperId, flowId, engagementId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        action: 'DecryptTrifactaWorkpaper',
        inputFilePath: null,
        engagementId,
        outputFilePath: null,
      },
    };

    return this.makeRequest(
      `/staging/storage/queuefilefordecryption/?workpaperId=${workpaperId}&flowId=${flowId}`,
      options
    );
  }

  async fileUpload(file, fileType, fileFormat, parentNodeId, fileName = null) {
    const formData = new FormData();
    formData.append('file', file, fileName || file.name);

    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest(
      `staging/storage/filenode?parentId=${parentNodeId}&fileType=${fileType}&fileFormat=${fileFormat}`,
      options
    );
  }

  async getFileEncoding(file, engagementId) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const options = {
      method: 'POST',
      data: formData,
    };

    return this.makeRequest(`staging/storage/${engagementId}/fileEncodingFromStream`, options);
  }
}

export default new StagingService();
