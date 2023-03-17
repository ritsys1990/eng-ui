import { Map as ImmutableMap } from 'immutable';
import { WorkpaperActionTypes } from './actionTypes';

const modalInitialState = ImmutableMap({
  tags: [],
  tagsLoading: true,
  addNewWorkpaperLoading: false,
  latestSearch: '',
});

export const initialState = ImmutableMap({
  list: [],
  fetchingList: false,
  addWorkpaperList: [],
  fetchingAddWorkpaperList: false,
  addWorkpaperSelected: '',
  linkList: [],
  fetchingLinkList: false,
  fetchingLabelConflicts: false,
  creatingWorkpaper: false,
  creatingWorkpaperAsync: false,
  isWorkpaperRefreshNeeded: true,
  isCopyingWorkpaper: false,
  isDeletingWorkpaper: false,
  isConfiguringBundle: false,
  isCreatingDataRequest: false,
  dataRequestInfo: [],
}).merge(modalInitialState);

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case WorkpaperActionTypes.GET_WORKPAPER_LIST_REQUEST:
    case WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST:
    case WorkpaperActionTypes.UPDATE_WORKPAPER_REQUEST:
      return state.merge({
        fetchingList: true,
      });

    case WorkpaperActionTypes.GET_WORKPAPER_LIST_SUCCESS:
      const { totalCount, items } = action.payload;

      const wpList = items ? [...items] : [];

      const wpListOrderedByCreatedDate = wpList.sort(
        (wp1, wp2) => Date.parse(wp2.creationDate) - Date.parse(wp1.creationDate)
      );

      return state.merge({
        fetchingList: false,
        list: {
          totalCount,
          items: wpListOrderedByCreatedDate,
        },
        isWorkpaperRefreshNeeded: false,
      });

    case WorkpaperActionTypes.GET_WORKPAPER_LIST_ERROR:
    case WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS:
    case WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR:
    case WorkpaperActionTypes.UPDATE_WORKPAPER_SUCCESS:
    case WorkpaperActionTypes.UPDATE_WORKPAPER_ERROR:
      return state.merge({
        fetchingList: false,
      });

    case WorkpaperActionTypes.SET_ADD_WORKPAPER_LIST:
      return state.merge({
        addWorkpaperList: action.payload,
      });

    case WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST:
      return state.merge({
        fetchingAddWorkpaperList: true,
        latestSearch: action.payload,
      });

    case WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS:
      let addWorkpaperList = { ...state.get('addWorkpaperList') };

      if (action.payload?.clear) {
        addWorkpaperList = action.payload?.list;
      } else if (addWorkpaperList?.items?.length < addWorkpaperList?.totalCount && action.payload?.list?.items) {
        addWorkpaperList.items = [...addWorkpaperList.items, ...action.payload.list.items];
      }

      return state.merge({
        fetchingAddWorkpaperList: false,
        addWorkpaperList: addWorkpaperList || state.get('addWorkpaperList'),
      });

    case WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR:
      return state.merge({
        fetchingAddWorkpaperList: false,
      });

    case WorkpaperActionTypes.SET_ADD_WORKPAPER_SELECTED:
      return state.merge({
        addWorkpaperSelected: action.payload,
      });

    case WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_REQUEST:
      return state.merge({
        fetchingLinkList: true,
      });

    case WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_SUCCESS:
      return state.merge({
        fetchingLinkList: false,
        linkList: action.payload,
      });

    case WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_ERROR:
      return state.merge({
        fetchingLinkList: false,
      });

    case WorkpaperActionTypes.CREATE_WORKPAPER_REQUEST:
      return state.merge({
        creatingWorkpaper: true,
      });

    case WorkpaperActionTypes.CREATE_WORKPAPER_SUCCESS:
    case WorkpaperActionTypes.CREATE_WORKPAPER_ERROR:
      return state.merge({
        creatingWorkpaper: false,
      });

    case WorkpaperActionTypes.GET_LABEL_CONFLICTS_REQUEST:
      return state.merge({
        fetchingLabelConflicts: true,
      });

    case WorkpaperActionTypes.GET_LABEL_CONFLICTS_SUCCESS:
    case WorkpaperActionTypes.GET_LABEL_CONFLICTS_ERROR:
      return state.merge({
        fetchingLabelConflicts: false,
      });

    case WorkpaperActionTypes.GET_ADD_WORKPAPER_TAGS_SUCCESS:
      return state.merge({
        tags: action.payload.items,
        tagsLoading: false,
      });

    case WorkpaperActionTypes.GET_ADD_WORKPAPER_TAGS_ERROR:
      return state.merge({
        tagsLoading: false,
      });

    case WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER:
    case WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER_SUCCESS:
    case WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER_FAILURE:
      return state.merge({
        addNewWorkpaperLoading: action.type === WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER,
      });

    case WorkpaperActionTypes.GET_ADD_NEW_WORKPAPER_RESET:
      return state.merge(modalInitialState);

    case WorkpaperActionTypes.COPY_WORKPAPER_REQUEST:
      return state.merge({
        isCopyingWorkpaper: true,
      });

    case WorkpaperActionTypes.COPY_WORKPAPER_SUCCESS:
      const prevList = state.get('list');
      const list = {
        totalCount: prevList.totalCount + 1,
        items: [action.payload, ...prevList.items],
      };

      return state.merge({
        list,
        isCopyingWorkpaper: false,
      });

    case WorkpaperActionTypes.COPY_WORKPAPER_ERROR:
      return state.merge({
        isCopyingWorkpaper: false,
      });

    case WorkpaperActionTypes.DELETE_WORKPAPER_REQUEST:
      return state.merge({
        isDeletingWorkpaper: true,
      });

    case WorkpaperActionTypes.DELETE_WORKPAPER_SUCCESS:
    case WorkpaperActionTypes.DELETE_WORKPAPER_ERROR:
      return state.merge({
        isWorkpaperRefreshNeeded: true,
        isDeletingWorkpaper: false,
      });

    case WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION:
      return state.merge({
        isConfiguringBundle: true,
      });

    case WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_SUCCESS:
    case WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_ERROR:
      return state.merge({
        isConfiguringBundle: false,
      });

    case WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST:
      return state.merge({
        isCreatingDataRequest: true,
      });

    case WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_SUCCESS:
      return state.merge({
        isCreatingDataRequest: false,
        dataRequestInfo: action.payload,
      });

    case WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_ERROR:
      return state.merge({
        isCreatingDataRequest: false,
      });

    case WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_REQUEST:
      return state.merge({
        creatingWorkpaperAsync: true,
        fetchingList: false,
      });

    case WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_SUCCESS:
    case WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_ERROR:
      return state.merge({
        isWorkpaperRefreshNeeded: true,
        creatingWorkpaperAsync: false,
        fetchingList: false,
      });

    default:
      return state;
  }
}
