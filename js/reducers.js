import {combineReducers} from 'redux';
import {XS, MD} from './actions';

// initial state
const initial_state = {
    contacts: [],
    newContact: {
        surname: undefined,
        name: undefined,
        email: undefined,
        description: undefined
    },
    path: '/',
    menu: {
        open: (()=> window.innerWidth <= XS ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    }
}

function contacts(contacts=initial_state.contacts, action) {
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
            return [...contacts, {...action.payload, status: action.meta.status || ''}];
        case 'clear contacts':
            return [];
        case 'remove contact':
            return contacts.filter((c)=>c.email!=action.payload ? true : false);
        default:
            return contacts;
    }
}

function path(path=initial_state.path, action) {
    switch(action.type) {
        case 'hashchange':
            if (action.payload) {
                return action.payload;    
            } else {
                return '/'
            }
        default:
            return path;
    }
}

function menu(menu=initial_state.menu, action) {
    switch (action.type) {
        case 'open menu':
            return menu.open ? menu : {
                ...menu,
                open: true,
                floating: action.payload.innerWidth<MD};
        case 'close menu':
            return menu.open ? {...menu, open: false, floating: false} : menu;
        case 'toggle menu':
            return {...menu, open: !menu.open, floating: action.payload.innerWidth<MD && !menu.open};
        default:
            return menu;
    }
}

export const globalreducer = combineReducers({menu, contacts, path});
