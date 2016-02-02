import {combineReducers} from 'redux';

// initial state
const initial_state = {
    contacts: [
        {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
        {key: 2, name: "Jim", email: "jim@example.com"},
        {key: 3, name: "Joe"},
    ],
    newContact: {name: undefined, email: undefined, description: undefined}
};

function contacts(contacts, action) {
    switch(action.type){
        case 'add contact':
            const newcontact = action.payload;
           if (newcontact){
                return [...contacts, newcontact];
            } else {
                return [...initial_state.contacts]
            }
        default:
            return initial_state.contacts;
    }
}


function path(path, action) {
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
