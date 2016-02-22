import {v4 as uuid} from 'uuid';

// XS media width is 48 * 'em' size in pixels // typeof is for mocha
export const EM = typeof window !== 'undefined' ? 
    Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const XS = 48*EM;
export const MD = 62*EM;



export function addDoc(doc, status=undefined) {
    console.log('action: ADD_DOC', doc);
    return {
        type: 'ADD_DOC',
        payload: doc,
        meta: {status}
    }
}

export function addDocs(docs) {
    console.log('action: ADD_DOCS');
    return {
        type: 'ADD_DOCS',
        payload: docs
    }
}

export function storeDoc(doc) {
    console.log('action: STORE_DOC');
    const mode = doc.uuid ? 'put' : 'add';
    if (mode == 'add') doc.uuid = uuid();
    console.log('async action: storing document')
    return (dispatch) => {
        dispatch(addDoc(doc, 'saving'));
        console.log('indedexDB: opening database')
        let openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = function(e) {
            console.log('indexedDB: creating transaction to store doc')
            let db = e.target.result;
            let transaction = db.transaction('docs', 'readwrite');
            transaction.oncomplete = () => {
                console.log('indexedDB: transaction completed');}
            transaction.onerror = () => {
                dispatch(docStatus(doc, 'error')); }
            var addrequest;
            try {
                console.log('indexedDB: adding doc in objectStore')
                addrequest = mode=='add' ? transaction.objectStore('docs').add(doc)
                                         : transaction.objectStore('docs').put(doc);
                addrequest.onsuccess = () => {
                    dispatch(docStatus(doc, 'stored'));
                    dispatch(clearForm()); }
                addrequest.onerror = () => {
                    console.log('indexedDB: error adding doc');
                    dispatch(docStatus(doc, 'error')); }
            } catch(e) {
                console.log('indexedDB: catched exception');
                dispatch(docStatus(doc, 'error'));
            }
        }
        openDB.onerror = () => { dispatch(docStatus(doc, 'error')); }
    }
}

export function docStatus(doc, status) {
    console.log('action: DOC_STATUS ' + status);
    return {
            type: 'DOC_STATUS',
            payload: doc,
            meta: {status}
    }
}

export function clearDocs() {
    console.log('action: CLEAR_DOCS')
    return {
        type: 'CLEAR_DOCS',
    }
}

export function loadDoc(uuid) {
    console.log('async action: LOAD_DOC');
    return (dispatch) => {
        console.log('indexedDB: opening database');
        var openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            console.log('indexedDB: reading objectstore')
            let openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').get(uuid);
            openCursor.onsuccess = (e) => {
                console.log('indexedDB: next cursor');
                let doc = e.target.result;
                if (Object.keys(doc).length) {
                    dispatch(setFormData(doc));
                    dispatch(addDoc(doc));
                }
            }
            openCursor.onerror = () => { dispatch(docStatus({}, 'error')); }
        }
        openDB.onerror = () => { dispatch(docStatus({}, 'error'));  }
    }
}

export function loadDocs(model) {
    console.log('async action: LOAD_DOCS');
    return (dispatch) => {
        console.log('indexedDB: opening database');
        var openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            console.log('indexedDB: reading objectstore');
            let openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').openCursor();
            dispatch(listStatus('loading'));
            var docs = [];
            openCursor.onsuccess = (e) => {
                console.log('indexedDB: next cursor');
                let cursor = e.target.result;
                if (cursor) {
                    docs.push(cursor.value);
                    cursor.continue();
                } else {
                    dispatch(listStatus('loaded'));
                    dispatch(addDocs(docs));
                }
            }
            openCursor.onerror = () => { dispatch(docStatus({}, 'error')); }
        }
        openDB.onerror = () => { dispatch(docStatus({}, 'error'));  }
    }
}

export function listStatus(status) {
    console.log('action: LIST_STATUS', status);
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

export function deleteDoc(doc) {
    console.log('async action: DELETE_DOC', doc);
    return (dispatch) => {
        dispatch(docStatus(doc, 'deleting'));
        console.log('indexedDB: opening database');
        window.indexedDB.open('tutodb', 1).onsuccess = (e) => {
            let req = e.target.result
                .transaction('docs', 'readwrite')
                .objectStore('docs').delete(doc.uuid);
            req.onsuccess = () => {
                dispatch(removeDoc(doc));
            }
            req.onerror = () => {
                dispatch(docStatus(doc, 'error'))
            }
        }
    }
}

export function openMenu() {
    return {
        type: 'OPEN_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function closeMenu() {
    return {
        type: 'CLOSE_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function toggleMenu() {
    return {
        type: 'TOGGLE_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function changeField(field) {
    return {
        type: 'CHANGE_FIELD',
        payload: {
            name: field.name,
            value: field.value
        }
    }
}

export function focusField(fieldname) {
    return {
        type: 'FOCUS_FIELD',
        payload: fieldname
    }
}

export function clearForm() {
    return {
        type: 'CLEAR_FORM'
    }
}

export function setFormData(doc) {
    console.log('action: SET_FORM_DATA', doc);
    return {
        type: 'SET_FORM_DATA',
        payload: doc,
    }
}

