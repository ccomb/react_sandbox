import {v4 as uuid} from 'uuid';
import {docStatus, addDoc, removeDoc} from '../listview/actions';

export function changeField(uuid, field) {
    return {
        type: 'CHANGE_FIELD',
        payload: {
            uuid: uuid,
            name: field.name,
            value: field.value
        }
    }
}

export function clearFormData() {
    console.log('action: CLEAR_FORM_DATA');
    return {
        type: 'CLEAR_FORM_DATA',
    }
}

export function setFormData(doc) {
    console.log('action: SET_FORM_DATA');
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
    return dispatch => {
        dispatch(addDoc(doc));
        dispatch(docStatus(doc.uuid, 'saving'));
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
                    }
                    dispatch(addDoc(doc));
                    dispatch(docStatus(doc.uuid, 'stored'));
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
    console.log('async action: loadDoc');
    return dispatch => {
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = e => {
            const openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').get(uuid);
            openCursor.onsuccess = e => {
                const doc = e.target.result;
                if (doc && Object.keys(doc).length) {
                    dispatch(setFormData(doc));
                }
            }
            openCursor.onerror = () => { console.log('ERROR'); }
        }
        openDB.onerror = () => { console.log('ERROR'); }
    }
}

export function loadLayouts(model) {
    console.log('async action: loadLayouts');
    return dispatch => {
        window.indexedDB.open('tutodb', 1).onsuccess = e => {
            e.target.result.transaction('docs', 'readonly')
            .objectStore('docs').index('layouts').get(['layouts', model]).onsuccess = (e) => {
                const doc = e.target.result;
                if (doc && Object.keys(doc).length) {
                    const layouts = doc.payload;
                    dispatch({
                        type: 'CHANGE_LAYOUT',
                        payload: {model, layouts},
                    });
                }
            }
        }
    }
}

function storeLayout(model, layouts) {
        const openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = function(e) {
            const db = e.target.result;
            const transaction = db.transaction(('docs'), 'readwrite');
            try {
                const getrequest = transaction.objectStore('docs').index('layouts').get(['layouts', model]);
                getrequest.onsuccess = e => {
                    const doc = e.target.result;
                    if (doc && doc.uuid) {
                        console.log('updating layout...', layouts)
                        const putrequest = transaction.objectStore('docs').put({...doc, payload: layouts})
                        putrequest.onsuccess = () => console.log('OK');
                    } else {
                        console.log('storing new layout...', layouts)
                        const addrequest = transaction.objectStore('docs').add({
                            uuid: uuid(),
                            model: 'layouts',
                            rel: model,
                            payload: layouts
                        })
                        addrequest.onsuccess = () => console.log('OK');
                        addrequest.onerror = () => console.log('ERROR');
                    }
                }
                getrequest.onerror = () => console.log('ERROR', e);
            } catch(e) {
                console.log('ERROR', e);
            }
        }
        openDB.onerror = () => { console.log('ERROR'); }
}

export function changeLayout(model, layouts) {
    console.log('action: CHANGE_LAYOUT')
    storeLayout(model, layouts);
    return {
        type: 'CHANGE_LAYOUT',
        payload: {model, layouts},
    };
}
