import {v4 as uuid} from 'uuid';

// XS media width is 48 * 'em' size in pixels // typeof is for mocha
export const XS = typeof window !== 'undefined' ?
    48*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const MD = typeof window !== 'undefined' ?
    62*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 992;



export function addDoc(doc, status=undefined) {
    console.log('Dispatching addDoc')
    return {
        type: 'add doc',
        payload: doc,
        meta: {status}
    }
}

export function storeDoc(doc) {
    doc.uuid = uuid();
    console.log('Dispatching storeDoc()')
    return (dispatch) => {
        console.log('Opening database')
        let openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = function(e) {
            console.log('Creating DB transaction to store doc')
            let db = e.target.result;
            let transaction = db.transaction('docs', 'readwrite');
            transaction.oncomplete = (e) => {
                console.log('transaction completed');}
            transaction.onerror = (e) => {
                dispatch(docAddFailed(doc)); }
            var addrequest;
            try {
                console.log('objectStore try to add')
                dispatch(addDoc(doc, 'saving'));
                addrequest = transaction.objectStore('docs').add(doc);
                addrequest.onsuccess = (e) => {
                    dispatch(docAdded(doc));
                    dispatch(clearForm()); }
                addrequest.onerror = (e) => {
                    console.log('addrequest onerror');
                    dispatch(docAddFailed(doc)); }
            } catch(e) {
                console.log('CATCHED EXCEPTION');
                dispatch(docAddFailed(doc));
            }
        }
        openDB.onerror = (e) => { dispatch(docAddFailed(doc)); }
    }
}

export function docAdded(doc) {
    console.log('Dispatching docAdded')
    return {
            type: 'doc added',
            payload: doc
    }
}

export function docAddFailed(doc) {
    console.log('Dispatching docAddFailed')
    return {
            type: 'doc add failed',
            payload: doc
    }
}

export function changeURLHash(hash) {
    // if hash is provided, then just change the hash
    // otherwise return a redux action
    console.log('Dispatching changeURLHash', hash)
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
    const {segments, current} = route;
    console.log('changeView', [...segments.slice(0, current), view, ...segments.slice(current+1)].join('/'))
    window.location.hash = [...segments.slice(0, current), view, ...segments.slice(current+1)].join('/');
}

export function finishDbRequest () {
    console.log('Dispatching finishDbRequest')
    return {
        type: 'finishrequest',
        payload: undefined
    }
}

export function clearRecords() {
    console.log('dispatching clearRecords')
    return {
        type: 'clear records',
    }
}

export function loadRecords (model) {
    console.log('dispatching loadRecords')
    return (dispatch) => {
        console.log('opening database');
        let openDB = window.indexedDB.open('tutodb', 1);
        openDB.onsuccess = (e) => {
            dispatch(clearRecords(model));
            console.log('reading objectstore with cursor')
            let openCursor = e.target.result.transaction('docs', 'readonly')
                          .objectStore('docs').openCursor()
            openCursor.onsuccess = (e) => {
                console.log('cursor open');
                let cursor = e.target.result;
                if (cursor) {
                    console.log('cursor not empty')
                    dispatch(addDoc(cursor.value));
                    cursor.continue();
                }
            }
            openCursor.onerror = (e) => { dispatch(docAddFailed({})); }
        }
        openDB.onerror = (e) => { dispatch(docAddFailed({}));  }
    }
}

export function removeDoc(uuid, status) {
    return {
        type: 'remove doc',
        payload: uuid,
        error: status=='error' ? true : false
    }
}

export function deleteDoc(uuid) {
    console.log('dispatching delete doc');
    return (dispatch) => {
        console.log('opening database');
        window.indexedDB.open('tutodb', 1).onsuccess = (e) => {
            let req = e.target.result
                .transaction('docs', 'readwrite')
                .objectStore('docs').delete(uuid);
            req.onsuccess = (e) => {
                dispatch(removeDoc(uuid));
            }
            req.onerror = (e) => {
                dispatch(removeDoc(uuid, 'error'))
            }
        }
    }
}

export function openMenu() {
    return {
        type: 'open menu',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function closeMenu() {
    return {
        type: 'close menu',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function toggleMenu() {
    return {
        type: 'toggle menu',
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
