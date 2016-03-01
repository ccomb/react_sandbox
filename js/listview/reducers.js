import {initialState} from '../reducers';

export function listview(listview=initialState.listview, action) {
    const {payload, meta} = action;
    switch(action.type){
        case 'ADD_DOC':
            if (listview.docs.some(d=>d.uuid===payload.uuid)) return listview;
            return {...listview,
                    docs: [payload, ...listview.docs],
                    docStatus: {...listview.docStatus, [payload.uuid]: meta}};
        case 'LOAD_DOCS':
            return payload !== listview.docs ? {...listview, docs: [...payload]} : listview;
        case 'DOC_STATUS':
            if (listview.docStatus[payload] === meta) return listview;
            return {...listview, docStatus: {...listview.docStatus, [payload]: meta}}
        case 'CLEAR_DOCS':
            return listview.docs.length ?
                {...listview, docs: [...initialState.listview.docs], selectColumn: false} : listview;
        case 'REMOVE_DOC':
            if (listview.docs.every(d=>d.uuid!==payload)) return listview;
            return {...listview,
                    docs: [...listview.docs.filter(d=>d.uuid!==payload)],
                    selectedUuids: listview.selectedUuids.filter(u=>u!==payload.uuid),
                    selectColumn: false,
                   };
        case 'SELECT_ROW':
            const selectedUuid = listview.docs[payload].uuid
            if (listview.selectedUuids.indexOf(selectedUuid)>=0) {
                return {...listview, selectedUuids: listview.selectedUuids.filter(u=>u!==selectedUuid)};
            } else {
                return {...listview, selectedUuids: [...listview.selectedUuids, selectedUuid]};
            }
        case 'LIST_STATUS':
            return payload === listview.listStatus ? payload : {...listview, listStatus: payload}
        case 'TOGGLE_SELECT_COLUMN':
            return {...listview, selectColumn: !listview.selectColumn};
        default:
            return listview;
    }
}
