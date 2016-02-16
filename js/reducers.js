import {combineReducers} from 'redux';
import {XS, MD} from './actions';

// Doc and initial value of the global redux state
const initial_state = {
    // The list of active docs indexed with their uuid
    docs: {},
    // the URL (starting at the hash)
    path: function() {},
    // currently selected menu
    get path() { return window.location.hash;  },
    menu: {
        open: (()=> window.innerWidth <= MD ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    },
    form: {
        // data of the currently displayed object
        data: {},
        // layout of the fields and widgets
        layout: {},
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
            return Object.keys(docs).length  ? {} : docs;
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
        case 'CHANGE_FIELD':
            console.log('reducing with ' + action.type);
            return {...form ,
                    data:{...form.data,
                    [action.payload.name]: action.payload.value}};
        case 'CLEAR_FORM':
            console.log('reducing with ' + action.type);
            return Object.keys(form).length ? initial_state.form : form;
        case 'FOCUS_FIELD':
            console.log('reducing with ' + action.type);
            return action.payload != form.focus ?
                {...form, focus: action.payload} : form;
        default:
            return form;
    }
}


export const globalreducer = combineReducers({form, menu, docs, path});
