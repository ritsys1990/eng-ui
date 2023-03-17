import { Map as ImmutableMap } from 'immutable';
import { AttachFilesActions } from './actionTypes';

export const initialState = ImmutableMap({
  inputId: null,
  isLoading: true,
  isFilePreviewLoading: false,
  folderStructureMap: ImmutableMap({}),
  datamodelTreeData: {},
  error: {},
  root: false,
  preview: {
    data: {},
    schema: {},
  },
  nodeId: null,
});

const INTERNAL_COLS = ['ordering_col_for_spark_internal'];

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case AttachFilesActions.PREVIEW: {
      return state.merge({
        isFilePreviewLoading: true,
        nodeId: null,
      });
    }
    case AttachFilesActions.GET_ROOT_FOLDER:
    case AttachFilesActions.GET_ALL_DATAMODELS_REQUEST:
    case AttachFilesActions.GET_CHILDREN_FOLDER:
    case AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_REQUEST:
      return state.merge({
        isLoading: true,
      });

    case AttachFilesActions.PREVIEW_FAILURE: {
      return state.merge({
        isFilePreviewLoading: false,
        error: action.error,
        nodeId: null,
      });
    }
    case AttachFilesActions.VALIDATION_ERROR: {
      return state.merge({
        error: {
          validation: action.validation,
        },
      });
    }
    case AttachFilesActions.PREVIEW_SUCCESS: {
      const { data, schema } = action.payload;

      const header = schema.map(item => item.name).filter(x => !INTERNAL_COLS.includes(x));
      const columns = action.payload.fileType === 'sheet' ? data.slice(1) : data.map(item => header.map(h => item[h]));

      return state.merge({
        isLoading: false,
        isFilePreviewLoading: false,
        preview: {
          type: action.payload.fileType,
          data: [header, ...columns],
        },
        nodeId: action.payload.nodeId,
        sheetData: action.payload.sheetData,
      });
    }

    case AttachFilesActions.GET_ROOT_FOLDER_SUCCESS: {
      const obj = {};
      action.payload.nodes.forEach(node => {
        obj[node.id] = { ...node, root: true, level: 0 };
      });

      return state.merge({
        isLoading: false,
        folderStructureMap: ImmutableMap(obj),
      });
    }

    case AttachFilesActions.GET_CHILDREN_FOLDER_SUCCESS: {
      const obj = {};
      action.payload.nodes.forEach(node => {
        obj[node.id] =
          node.typeOfNode !== 0 // !DOCUMENT
            ? { ...node, level: action.payload.path.length }
            : node;
      });

      const wayToPut = action.payload.path.join(',nodes,').split(',');
      wayToPut.unshift('folderStructureMap');
      wayToPut.push('nodes');

      return state.setIn([...wayToPut], ImmutableMap(obj)).merge({
        isLoading: false,
      });
    }

    case AttachFilesActions.GET_CHILDREN_FOLDER_ERROR:
    case AttachFilesActions.GET_ROOT_FOLDER_ERROR:
    case AttachFilesActions.GET_ALL_DATAMODELS_ERROR:
    case AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_ERROR:
      return state.merge({
        isLoading: false,
      });

    case AttachFilesActions.GET_ALL_DATAMODELS_SUCCESS: {
      return state.merge({
        isLoading: false,
        datamodelTreeData: action.payload,
      });
    }

    case AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_SUCCESS: {
      const headerName = action.payload.fields.map(eachField => eachField.nameTech);

      return state.merge({
        isLoading: false,
        isFilePreviewLoading: false,
        preview: {
          type: action.payload.fileType,
          data: [headerName, []],
        },
        nodeId: action.payload.id,
      });
    }

    case AttachFilesActions.PREVIEW_SHEET: {
      return state.merge({
        isFilePreviewLoading: true,
      });
    }
    case AttachFilesActions.PREVIEW_SHEET_SUCCESS: {
      const { data, schema } = action.payload;

      const header = schema.map(item => item.name).filter(x => !INTERNAL_COLS.includes(x));
      const rows = data.slice(1);

      return state.merge({
        isFilePreviewLoading: false,
        preview: {
          type: 'sheet',
          data: [header, ...rows],
        },
      });
    }
    case AttachFilesActions.PREVIEW_SHEET_FAILURE: {
      return state.merge({
        isFilePreviewLoading: false,
      });
    }

    default: {
      return state;
    }
  }
}
