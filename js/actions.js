import {v4 as uuid} from 'uuid';
import {addDoc, removeDoc, docStatus, listStatus} from './listview/actions';
import {setFormData, clearFormData} from './formview/actions';

// XS media width is 48 * 'em' size in pixels // typeof is for mocha
export const EM = typeof window !== 'undefined' ? 
    Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const XS = 48*EM;
export const MD = 62*EM;


export function storeDoc(model, _doc) {
    console.log('action: STORE_DOC');
    const doc = {..._doc, model};
    const mode = doc.uuid ? 'put' : 'add';
    if (mode == 'add') doc.uuid = uuid();
    console.log('async action: storing document')
    return (dispatch) => {
        dispatch(addDoc(doc, 'saving'));
        console.log('indedexDB: opening database')
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = function(e) {
            console.log('indexedDB: creating transaction to store doc')
            const db = e.target.result;
            const transaction = db.transaction(('docs'), 'readwrite');
            transaction.oncomplete = () => {
                console.log('indexedDB: transaction completed');}
            transaction.onerror = () => {
                dispatch(docStatus(doc.uuid, 'error')); }
            try {
                console.log('indexedDB: adding doc in objectStore')
                const addrequest = mode=='add' ? transaction.objectStore('docs').add(doc)
                                         : transaction.objectStore('docs').put(doc);
                addrequest.onsuccess = () => {
                    if (mode === 'put') {
                        dispatch(removeDoc(doc));
                        dispatch(addDoc(doc), 'stored');
                    } else {
                        dispatch(docStatus(doc.uuid, 'stored'));
                    }
                    dispatch(clearFormData()); }
                addrequest.onerror = () => {
                    console.log('indexedDB: error adding doc');
                    dispatch(docStatus(doc.uuid, 'error')); }
            } catch(e) {
                console.log('indexedDB: catched exception');
                dispatch(docStatus(doc.uuid, 'error'));
            }
        }
        openDB.onerror = () => { dispatch(docStatus(doc.uuid, 'error')); }
    }
}

export function loadDoc(uuid) {
    console.log('async action: LOAD_DOC');
    return (dispatch) => {
        console.log('indexedDB: opening database');
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            console.log('indexedDB: reading objectstore')
            const openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').get(uuid);
            openCursor.onsuccess = (e) => {
                console.log('indexedDB: next cursor');
                const doc = e.target.result;
                if (Object.keys(doc).length) {
                    dispatch(setFormData(doc));
                }
            }
            openCursor.onerror = () => { dispatch(docStatus(null, 'error')); }
        }
        openDB.onerror = () => { dispatch(docStatus(null, 'error'));  }
    }
}

export function loadDocs(model) {
    console.log('async action: LOAD_DOCS');
    return (dispatch) => {
        console.log('indexedDB: opening database');
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            console.log('indexedDB: reading objectstore');
            const openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').openCursor();
            dispatch(listStatus('loading'));
            const docs = [];
            openCursor.onsuccess = (e) => {
                console.log('indexedDB: next cursor');
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

export function toggleSelectColumn() {
    console.log('action: toggleSelectColumn');
    return {
        type: 'TOGGLE_SELECT_COLUMN'
    }
}
