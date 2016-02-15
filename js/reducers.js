import {combineReducers} from 'redux';
import {XS, MD} from './actions';

// initial state
const initial_state = {
    docs: {}, // The list of active docs indexed with their uuid
    path: function() {},
    get path() { return window.location.hash;  },
    menu: {
        open: (()=> window.innerWidth <= MD ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    },
    form: {
    }
}

function docs(docs=initial_state.docs, action) {
    switch(action.type){
        case 'doc added':
            console.log('reducing with ' + action.type)
            const newdoc = {...action.payload, status: 'saved'};
           if (newdoc){
                return {...docs, [newdoc.uuid]:newdoc};
            } else {
                return [...initial_state.docs]
            }
        case 'doc add failed':
            console.log('reducing with ' + action.type)
            return {...docs, [action.payload.uuid]: {...action.payload, status: 'unsaved'}};
        case 'add doc':
            console.log('reducing with ' + action.type)
            return {...docs, [action.payload.uuid]: {...action.payload, status: action.meta.status || ''}};
        case 'clear docs':
            console.log('reducing with ' + action.type)
            return docs  ? {} : docs;
        case 'remove doc':
            console.log('reducing with ' + action.type)
            var newdocs = {...docs};
            delete newdocs[action.payload];
            return newdocs;
        default:
            return docs;
    }
}

function path(path=initial_state.path, action) {
    switch(action.type) {
        case 'CHANGE_HASH':
            console.log('reducing with ' + action.type);
            return path == action.payload ? path : action.payload;
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


export const globalreducer = combineReducers({form, menu, docs, path});
