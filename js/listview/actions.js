
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

export function loadDocs(model) {
    console.log('async action: LOAD_DOCS');
    return (dispatch) => {
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            const openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').openCursor();
            dispatch(listStatus('loading'));
            const docs = [];
            openCursor.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    if (cursor.value.model === model) {
                        docs.push(cursor.value); // FIXME slow?
                    }
                    cursor.continue();
                } else {
                    dispatch(listStatus('loaded'));
                    dispatch({
                        type: 'LOAD_DOCS',
                        payload: docs
                    })
                }
            }
            openCursor.onerror = () => { dispatch(docStatus(null, 'error')); }
        }
        openDB.onerror = () => { dispatch(docStatus(null, 'error'));  }
    }
}

export function deleteDocs(uuids) {
    console.log('async action: DELETE_DOC');
    return (dispatch) => {
        uuids.forEach(uuid=>dispatch(docStatus(uuid, 'deleting')));
        console.log('indexedDB: opening database');
        window.indexedDB.open('tutodb', 1).onsuccess = (e) => {
            uuids.forEach(uuid=>{
                const req = e.target.result.transaction('docs', 'readwrite').objectStore('docs').delete(uuid);
                req.onsuccess = () => {
                    dispatch(removeDoc(uuid));
                }
                req.onerror = () => {
                    dispatch(docStatus(uuid, 'error'))
                }
            })
        }
    }
}

