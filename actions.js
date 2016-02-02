
export function addContact(contact) {
    return {
        type: 'add contact',
        payload: contact    
    }
}


export function changeHash(hash) {
    var path = window.location.hash.split('/').slice(1)[0]
    if (!path) {path = '/'}
    return {
        type: 'hashchange',
        payload: path
    }
}
