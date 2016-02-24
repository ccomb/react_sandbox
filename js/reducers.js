import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';
import {MD} from './actions';

// Doc and initial value of the global redux state, which correspond to the working space in memory
export const initialState = {
    listview: {
        // displayed docs
        docs: [],
        // selected docs (list of uuid)
        selectedRows: [],
        docStatus: {}, // keys are uuids
        listStatus: '',
    },
    menu: {
        open: (()=> window.innerWidth <= MD ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    },
    formview: {
        // data of the currently displayed object
        data: {},
        // layout of the fields and widgets
        layout: {},
    }
}

function listview(listview=initialState.listview, action) {
    const {payload, meta} = action;
    switch(action.type){
        case 'ADD_DOC':
            if (listview.docs.some(d=>d.uuid===payload.uuid)) return listview;
            return {...listview,
                    docs: [payload, ...listview.docs],
                    docStatus: {...listview.docStatus, [payload.uuid]: meta}};
        case 'LOAD_DOCS':
            return payload !== listview.docs ? {...listview, docs: [...payload]} : listview;
        case 'DOC_STATUS':
            if (listview.docStatus[payload] === meta) return listview;
            return {...listview, docStatus: {...listview.docStatus, [payload]: meta}}
        case 'CLEAR_DOCS':
            return listview.docs.length ? {...listview, docs: [...initialState.listview.docs]} : listview;
        case 'REMOVE_DOC':
            if (listview.docs.every(d=>d.uuid!==payload)) return listview;
            return {...listview, docs: [...listview.docs.filter(d=>d.uuid!==payload)]};
        case 'SELECT_ROWS':
            if (payload === listview.selectedRows) return listview;
            return {...listview, selectedRows: payload.map(r=>listview.docs[r].uuid)};
        case 'LIST_STATUS':
            return payload === listview.listStatus ? payload : {...listview, payload}
        default:
            return listview;
    }
}

function menu(menu=initialState.menu, action) {
    switch (action.type) {
        case 'OPEN_MENU':
            return menu.open ? menu : {
                ...menu,
                open: true,
                floating: action.payload.innerWidth<MD};
        case 'CLOSE_MENU':
            return menu.open ? {...menu, open: false, floating: false} : menu;
        case 'TOGGLE_MENU':
            return {...menu, open: !menu.open, floating: action.payload.innerWidth<MD && !menu.open};
        default:
            return menu;
    }
}

function formview(formview=initialState.formview, action) {
    switch (action.type) {
        case 'CHANGE_FIELD':
            return {...formview ,
                    data:{...formview.data,
                    [action.payload.name]: action.payload.value}};
        case 'SET_FORM_DATA':
            return action.payload !== formview.data ?
                   {...formview , data: {...action.payload}} : formview;
        case 'CLEAR_FORM_DATA':
            return Object.keys(formview.data).length ?
                   {...formview, data:{...initialState.formview.data}} : formview;
        case 'FOCUS_FIELD':
            return action.payload != formview.focus ?
                {...formview, focus: action.payload} : formview;
        default:
            return formview;
    }
}

export const globalreducer = combineReducers(
    {routing: routeReducer, formview, menu, listview});
