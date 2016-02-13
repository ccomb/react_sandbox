import {combineReducers} from 'redux';
import {XS, MD} from './actions';

// initial state
const initial_state = {
    contacts: [],
    path: '/',
    menu: {
        open: (()=> window.innerWidth <= MD ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    },
    form: {
    }
}

function contacts(contacts=initial_state.contacts, action) {
    switch(action.type){
        case 'contact added':
            console.log('reducing with ' + action.type)
            const newcontact = {...action.payload, status: 'saved'};
           if (newcontact){
                return [...contacts.slice(0, -1), newcontact];
            } else {
                return [...initial_state.contacts]
            }
        case 'contact add failed':
            console.log('reducing with ' + action.type)
            return [...contacts.slice(0, -1), {...action.payload, status: 'unsaved'}];
        case 'add contact':
            console.log('reducing with ' + action.type)
            return [...contacts, {...action.payload, status: action.meta.status || ''}];
        case 'clear contacts':
            console.log('reducing with ' + action.type)
            return contacts && contacts.length ? [] : contacts;
        case 'remove contact':
            console.log('reducing with ' + action.type)
            return contacts.filter((c)=>c.email!=action.payload ? true : false);
        default:
            return contacts;
    }
}

function path(path=initial_state.path, action) {
    switch(action.type) {
        case 'hashchange':
            console.log('reducing with ' + action.type)
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
            console.log('reducing with ' + action.type)
            return menu.open ? menu : {
                ...menu,
                open: true,
                floating: action.payload.innerWidth<MD};
        case 'close menu':
            console.log('reducing with ' + action.type)
            return menu.open ? {...menu, open: false, floating: false} : menu;
        case 'toggle menu':
            console.log('reducing with ' + action.type)
            return {...menu, open: !menu.open, floating: action.payload.innerWidth<MD && !menu.open};
        default:
            return menu;
    }
}

function form(form=initial_state.form, action) {
    switch (action.type) {
        case 'ONCHANGE_FIELD':
            console.log('reducing with ' + action.type);
            return {...form, [action.payload.name]: action.payload.value};
        case 'CLEAR_FORM':
            console.log('reducing with ' + action.type);
            return form ? {} : form;
        default:
            return form;
    }
}


export const globalreducer = combineReducers({form, menu, contacts, path});
