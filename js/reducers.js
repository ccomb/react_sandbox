import {combineReducers} from 'redux';

// XS media width is 48 * 'em' size in pixels
export const XS = () => 48*Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);

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
        open: (()=> window.innerWidth <= XS() ? true : false)()
    }
}

function contacts(contacts, action) {
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

function menu(menu, action) {
    switch (action.type) {
        case 'open menu':
            return {...menu, open: true};
        case 'close menu':
            return {...menu, open: false};
        case 'toggle menu':
            return {...menu, open: !menu.open};
        default:
            return window.screen.width <= XS() ? true : false;
    }
}

export const globalreducer = combineReducers({contacts, path, menu});
