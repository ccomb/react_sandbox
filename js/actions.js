// XS media width is 48 * 'em' size in pixels
export const XS = 48*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
export const MD = 62*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);


export function addContact(contact, status=undefined) {
    console.log('Dispatching addContact')
    return {
        type: 'add contact',
        payload: contact,
        meta: {status}
    }
}

export function storeContact(contact) {
    console.log('Dispatching storeContact()')
    return (dispatch) => {
        console.log('Opening database')
        let request = window.indexedDB.open('tutodb', 3);
        request.onsuccess = function(e) {
            console.log('Creating DB transaction to store contact')
            let db = e.target.result;
            let transaction = db.transaction('contacts', 'readwrite');
            transaction.oncomplete = (e) => {
                console.log('transaction completed');}
            transaction.onerror = (e) => {
                console.log(e);
                dispatch(contactAddFailed(contact)); }
            var addrequest;
            try {
                console.log('objectStore try to add')
                dispatch(addContact(contact, 'saving'));
                addrequest = transaction.objectStore('contacts').add(contact);
                addrequest.onsuccess = (e) => {
                    console.log(e);
                    dispatch(contactAdded(contact));
                    dispatch(clearForm()); }
                addrequest.onerror = (e) => {
                    console.log('addrequest onerror');
                    console.log(e);
                    dispatch(contactAddFailed(contact)); }
            } catch(e) {
                console.log('CATCHED EXCEPTION');
                console.log(e);
                dispatch(contactAddFailed(contact));
            }
        }
        request.onerror = (e) => { dispatch(contactAddFailed(contact)); }
    }
}

export function contactAdded(contact) {
    console.log('Dispatching contactAdded')
    return {
            type: 'contact added',
            payload: contact
    }
}

export function contactAddFailed(contact) {
    console.log('Dispatching contactAddFailed')
    return {
            type: 'contact add failed',
            payload: contact
    }
}

export function changeHash(hash) {
    console.log('Dispatching changeHash')
    var path = window.location.hash.split('/').slice(1)[0]
    if (!path) {path = '/'}
    return {
        type: 'hashchange',
        payload: path
    }
}

export function finishDbRequest () {
    console.log('Dispatching finishDbRequest')
    return {
        type: 'finishrequest',
        payload: undefined
    }
}

export function clearContacts() {
    console.log('dispatching clearContacts')
    return {
        type: 'clear contacts',
    }
}

export function loadContacts () {
    console.log('dispatching loadContacts')
    return (dispatch) => {
        console.log('opening database');
        let openrequest = window.indexedDB.open('tutodb', 3);
        openrequest.onsuccess = (e) => {
            dispatch(clearContacts());
            console.log('reading objectstore with cursor')
            let request = e.target.result.transaction('contacts', 'readonly')
                          .objectStore('contacts').openCursor()
            request.onsuccess = (e) => {
                console.log('cursor open');
                let cursor = e.target.result;
                if (cursor) {
                    console.log('cursor not empty')
                    dispatch(addContact(cursor.value));
                    cursor.continue();
                }
            }
            request.onerror = (e) => { dispatch(contactAddFailed()); }
        }
        openrequest.onerror = (e) => { dispatch(contactAddFailed());  }
    }
}

export function removeContact(email, status) {
    return {
        type: 'remove contact',
        payload: email,
        error: status=='error' ? true : false
    }
}

export function deleteContact(email) {
    console.log('dispatching delete contact');
    return (dispatch) => {
        console.log('opening database');
        window.indexedDB.open('tutodb', 3).onsuccess = (e) => {
            let req = e.target.result
                .transaction('contacts', 'readwrite')
                .objectStore('contacts').delete(email);
            req.onsuccess = (e) => {
                dispatch(removeContact(email));
            }
            req.onerror = (e) => {
                dispatch(removeContact(email, 'error'))
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

export function onchangeField(field) {
    return {
        type: 'ONCHANGE_FIELD',
        payload: {
            name: field.id,
            value: field.value
        }
    }
}

export function clearForm() {
    return {
        type: 'CLEAR_FORM'
    }
}
