import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';
import {MD} from './actions';

// Doc and initial value of the global redux state, which correspond to the working space in memory
export const initialState = {
    // The list of active docs indexed with their uuid
    docs: [],
    status: {
        list: null,
    },
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

function docs(docs=initialState.docs, action) {
    const doc = action.payload;
    switch(action.type){
        case 'ADD_DOC':
            console.log('reduce: ' + action.type);
            return [...docs, {...doc, status: action.meta.status}];
        case 'LOAD_DOCS':
            console.log('reduce: ' + action.type);
            return action.payload !== docs ? [...action.payload] : docs;
        case 'DOC_STATUS':
           const newdoc = {...doc, status: action.meta.status};
           return [...docs.map((d) => d.uuid===newdoc.uuid ? newdoc : d)];
        case 'CLEAR_DOCS':
            return docs.length ? [...initialState.docs] : docs;
        case 'REMOVE_DOC':
            return [...docs.filter((d) => d.uuid!==doc.uuid)];
        default:
            return docs;
    }
}

function menu(menu=initialState.menu, action) {
    switch (action.type) {
        case 'OPEN_MENU':
            console.log('reduce: ' + action.type)
            return menu.open ? menu : {
                ...menu,
                open: true,
                floating: action.payload.innerWidth<MD};
        case 'CLOSE_MENU':
            console.log('reduce: ' + action.type)
            return menu.open ? {...menu, open: false, floating: false} : menu;
        case 'TOGGLE_MENU':
            console.log('reduce: ' + action.type);
            return {...menu, open: !menu.open, floating: action.payload.innerWidth<MD && !menu.open};
        default:
            return menu;
    }
}

function form(form=initialState.form, action) {
    switch (action.type) {
        case 'CHANGE_FIELD':
            console.log('reduce: ' + action.type);
            return {...form ,
                    data:{...form.data,
                    [action.payload.name]: action.payload.value}};
        case 'SET_FORM_DATA':
            console.log('reduce: ' + action.type);
            return action.payload !== form.data ? {...form , data: action.payload} : form;
        case 'CLEAR_FORM':
            console.log('reduce: ' + action.type);
            return Object.keys(form).length ? {...initialState.form} : form;
        case 'FOCUS_FIELD':
            console.log('reduce: ' + action.type);
            return action.payload != form.focus ?
                {...form, focus: action.payload} : form;
        default:
            return form;
    }
}

function status(status=initialState.status, action) {
    switch (action.type) {
        case 'LIST_STATUS':
            return action.payload === status.list ?
                status : {...status, list: action.payload};
        default:
            return status;
    }
}
export const globalreducer = combineReducers(
    {routing: routeReducer, form, menu, docs, status});
