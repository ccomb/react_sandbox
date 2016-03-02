import {v4 as uuid} from 'uuid';
import {docStatus, addDoc, removeDoc} from '../listview/actions';

export function changeField(field) {
    return {
        type: 'CHANGE_FIELD',
        payload: {
            name: field.name,
            value: field.value
        }
    }
}

export function clearFormData() {
    console.log('action: CLEAR_FORM_DATA');
    return {
        type: 'CLEAR_FORM_DATA',
        payload: null,
    }
}

export function setFormData(doc) {
    console.log('action: SET_FORM_DATA', doc);
    return {
        type: 'SET_FORM_DATA',
        payload: doc,
    }
}

export function storeDoc(model, _doc) {
    console.log('action: STORE_DOC');
    const doc = {..._doc, model};
    const mode = doc.uuid ? 'put' : 'add';
    if (mode == 'add') doc.uuid = uuid();
    return (dispatch) => {
        dispatch(addDoc(doc, 'saving'));
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = function(e) {
            const db = e.target.result;
            const transaction = db.transaction(('docs'), 'readwrite');
            try {
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
                    dispatch(docStatus(doc.uuid, 'error')); }
            } catch(e) {
                dispatch(docStatus(doc.uuid, 'error'));
            }
        }
        openDB.onerror = () => { dispatch(docStatus(doc.uuid, 'error')); }
    }
}

export function loadDoc(uuid) {
    console.log('async action: LOAD_DOC');
    return (dispatch) => {
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            const openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').get(uuid);
            openCursor.onsuccess = (e) => {
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
