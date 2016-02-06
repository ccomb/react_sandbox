
export function addContact(contact) {
    console.log('Dispatching addContact')
    return {
        type: 'add contact',
        payload: contact
    }
}

export function storeContact(contact) {
    console.log('Dispatching storeContact()')
    return (dispatch) => {
        console.log('Opening database')
        let request = window.indexedDB.open('tutodb3', 1);
        request.onsuccess = function(e) {
            console.log('Creating DB transaction to store contact')
            let db = e.target.result;
            let transaction = db.transaction('contacts', 'readwrite');
            transaction.onsuccess = (e) => { console.log('transaction success'); dispatch(contactAdded(contact)); }
            transaction.oncomplete = (e) => { console.log('transaction complete');dispatch(contactAdded(contact)); }
            transaction.onerror = (e) => { console.log(e); dispatch(contactAddFailed(contact)); }
            var addrequest;
            try {
                console.log('objectStore add')
                addrequest = transaction.objectStore('contacts').add(contact);
                addrequest.onerror = (e) => { console.log(e); dispatch(contactAddFailed(contact)); }
                dispatch(addContact(contact));
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
