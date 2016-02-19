import {v4 as uuid} from 'uuid';

// XS media width is 48 * 'em' size in pixels // typeof is for mocha
export const XS = typeof window !== 'undefined' ?
    48*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const MD = typeof window !== 'undefined' ?
    62*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 992;



export function addDoc(doc, status=undefined) {
    console.log('action: ADD_DOC', doc, status);
    return {
        type: 'ADD_DOC',
        payload: doc,
        meta: {status}
    }
}

export function storeDoc(doc) {
    console.log('action: STORE_DOC');
    doc.uuid = uuid();
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
                addrequest = transaction.objectStore('docs').add(doc);
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

export function changeURLHash(hash) {
    // if hash is provided, then just change the hash
    // otherwise return a redux action
    console.log('action: CHANGE_HASH ' + hash);
    if (hash) {
        window.location.hash = hash;
        return
    }
    return {
        type: 'CHANGE_HASH',
        payload: window.location.hash
    }
}

export function changeView(route, view) {
    // not a redux action, but the changeURLHash should then be triggered
    console.log('action: CHANGE_VIEW ' + view);
    const {segments, current} = route;
    window.location.hash = [...segments.slice(0, current+1), view, ...segments.slice(current+2)].join('/');
    return {
        type: 'CHANGE_VIEW',
        payload: view
    }
}

export function clearDocs() {
    console.log('action: CLEAR_DOCS')
    return {
        type: 'CLEAR_DOCS',
    }
}

export function loadRecords (model) {
    console.log('async action: LOAD_RECORDS')
    return (dispatch) => {
        console.log('indexedDB: opening database');
        var openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            console.log('indexedDB: reading objectstore')
            let openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').openCursor()
            openCursor.onsuccess = (e) => {
                console.log('indexedDB: next cursor');
                let cursor = e.target.result;
                if (cursor) {
                    dispatch(addDoc(cursor.value));
                    cursor.continue();
                }
            }
            openCursor.onerror = () => { dispatch(docStatus({}, 'error')); }
        }
        openDB.onerror = () => { dispatch(docStatus({}, 'error'));  }
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
    console.log('async action: DELETE_DOC');
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
