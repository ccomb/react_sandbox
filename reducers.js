import {combineReducers} from 'redux';

// initial state
const initial_state = {
    contacts: [
        {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
        {key: 2, name: "Jim", email: "jim@example.com"},
        {key: 3, name: "Joe"},
    ],
    newContact: {name: undefined, email: undefined, description: undefined},
    path: '/'
};

export function contacts(contacts, action) {
    switch(action.type){
        case 'contact added':
            console.log('reducing with contact added')
            const newcontact = {...action.payload, status: 'saved'};
           if (newcontact){
                return [...contacts.slice(0, -1), newcontact];
            } else {
                return [...initial_state.contacts]
            }
        case 'contact add failed':
            return [...contacts.slice(0, -1), {...action.payload, status: 'unsaved'}];
        case 'add contact':
            console.log('reducing with add contact')
            return [...contacts, {...action.payload, status: 'saving'}];
        default:
            return initial_state.contacts;
    }
}

export function path(path, action) {
    const oldpath = path;
    const newpath=action.payload;
    switch(action.type) {
        case 'hashchange':
            if (newpath) {
                return newpath;    
            } else {
                return '/'
            }
        default:
            return oldpath ? oldpath : '/';
    }
}

const globalreducer = combineReducers({contacts, path});
export default globalreducer;
