
export function addDoc(doc, status=undefined) {
    console.log('action: ADD_DOC');
    return {
        type: 'ADD_DOC',
        payload: doc,
        meta: status
    }
}

export function docStatus(uuid, status) {
    console.log('action: DOC_STATUS ');
    return {
            type: 'DOC_STATUS',
            payload: uuid,
            meta: status
    }
}

export function clearDocs() {
    console.log('action: CLEAR_DOCS')
    return {
        type: 'CLEAR_DOCS',
    }
}

export function listStatus(status) {
    console.log('action: LIST_STATUS');
    return {
        type: 'LIST_STATUS',
        payload: status
    }
}

export function removeDoc(doc) {
    console.log('action: REMOVE_DOC')
    return {
        type: 'REMOVE_DOC',
        payload: doc
    }
}

export function selectRow(row) {
    console.log('action: selectRow');
    return {
        type: 'SELECT_ROW',
        payload: row,
    }
}
