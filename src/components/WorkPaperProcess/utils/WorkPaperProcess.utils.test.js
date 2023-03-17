import { checkForZipUploadWarnings } from './WorkPaperProcess.utils';
import LANGUAGE_DATA from 'src/languages/fallback.json';

const t = key => {
  return LANGUAGE_DATA[`Engagement_${key}`];
};

const inputs = [
  {
    id: 'e016148d-81ce-4fef-a7a3-d5d8d7b2b077',
    status: 'done',
    fileName: 'Book1.csv',
    nodeId: '5f1f2b529bf56701626127b5',
    error: null,
    fileHistory: ['Book1.csv', 'Book1.csv'],
    uploadMethod: 'zip',
    name: 'Book1',
    required: true,
    datamodelId: null,
    file: {
      nodeId: '5f1f2b529bf56701626127b5',
      url:
        '/dev/cortex/filesystem/US/e67dc025-6b17-4926-b19d-65edc6427d44___makecortexprettyagain/Engagement/Daivik/User Imported Data/tmp/Extracted_d17d2897-2afc-4380-8583-2b70df05aed4/d17d2897-2afc-4380-8583-2b70df05aed4_Upload.zip/Book1.csv',
      delimiter: ',',
    },
    bundleTransformationId: null,
    bundleBaseId: null,
    trifactaInputId: 4587,
  },
  {
    id: '3c61cf90-27cb-4312-8336-742dda853645',
    status: 'done',
    fileName: 'Book2.csv',
    nodeId: '5f1f2b529bf56701626127b6',
    error: null,
    fileHistory: ['Book2.csv', 'Book2.csv'],
    name: 'Book2',
    required: true,
    datamodelId: null,
    uploadMethod: 'zip',
    file: {
      nodeId: '5f1f2b529bf56701626127b6',
      url:
        '/dev/cortex/filesystem/US/e67dc025-6b17-4926-b19d-65edc6427d44___makecortexprettyagain/Engagement/Daivik/User Imported Data/tmp/Extracted_d17d2897-2afc-4380-8583-2b70df05aed4/d17d2897-2afc-4380-8583-2b70df05aed4_Upload.zip/Book2.csv',
      delimiter: ',',
    },
    bundleTransformationId: null,
    bundleBaseId: null,
    trifactaInputId: 4588,
  },
];

describe('WorkPaperProcess.util', () => {
  it('checkForZipUploadWarnings should return Extra Folder Message', () => {
    const inputWarnings = checkForZipUploadWarnings(inputs, 'append', ['Book1', 'Book2', 'Book3'], t);
    expect(inputWarnings[0].message).toEqual(
      `${t('Component_Zip_Upload_Warning_All_Matches_Extra_Folder1')} Book3. ${t(
        'Component_Zip_Upload_Warning_All_Matches_Extra_Folder2'
      )}`
    );
  });

  it('checkForZipUploadWarnings should return some folders matches but extra folders', () => {
    const inputWarnings = checkForZipUploadWarnings(inputs, 'append', ['Book1', 'Book3', 'Book4'], t);
    expect(inputWarnings[0].message).toEqual(
      `${t('Component_Zip_Upload_Warning_All_Matches_Extra_Folder1')} Book3, Book4. ${t(
        'Component_Zip_Upload_Warning_All_Matches_Extra_Folder2'
      )}`
    );

    expect(inputWarnings[1].message).toEqual(
      `${t('Component_Zip_Upload_Warning_Some_Matches1')} Book2. ${t('Component_Zip_Upload_Warning_Some_Matches2')}`
    );
  });

  it('checkForZipUploadWarnings should return some folders matches', () => {
    const inputWarnings = checkForZipUploadWarnings(inputs, 'append', ['Book1', 'Book3'], t);

    expect(inputWarnings[0].message).toEqual(
      `${t('Component_Zip_Upload_Warning_All_Matches_Extra_Folder1')} Book3. ${t(
        'Component_Zip_Upload_Warning_All_Matches_Extra_Folder2'
      )}`
    );

    expect(inputWarnings[1].message).toEqual(
      `${t('Component_Zip_Upload_Warning_Some_Matches1')} Book2. ${t('Component_Zip_Upload_Warning_Some_Matches2')}`
    );
  });

  it('checkForZipUploadWarnings should return error', () => {
    const inputWarnings = checkForZipUploadWarnings(inputs, 'append', ['Book3', 'Book4'], t);

    expect(inputWarnings[0].message).toEqual(`${t('Component_Zip_Upload_Warning_None_Matches')}`);
  });

  it('checkForZipUploadWarnings should return null', () => {
    const inputWarnings = checkForZipUploadWarnings(inputs, 'overwrite', ['Book1', 'Book3'], t);
    expect(inputWarnings).toEqual(null);
  });
});
