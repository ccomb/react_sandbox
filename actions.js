
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
            transaction.onsuccess = (e) => {
                console.log('transaction success');
                dispatch(contactAdded(contact)); }
            transaction.oncomplete = (e) => {
                console.log('transaction complete');
                dispatch(contactAdded(contact)); }
            transaction.onerror = (e) => {
                console.log(e);
                dispatch(contactAddFailed(contact)); }
            var addrequest;
            try {
                console.log('objectStore add')
                addrequest = transaction.objectStore('contacts').add(contact);
                addrequest.onerror = (e) => {
                    console.log(e);
                    dispatch(contactAddFailed(contact)); }
                dispatch(addContact(contact, 'saving'));
            } catch(e) {
                console.log(e);
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
            console.log('');
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
