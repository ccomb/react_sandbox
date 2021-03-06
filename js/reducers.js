import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {isMobile, isLaptop, getDevice} from './actions';
import {layouts as initialLayouts} from "./schema";

// Doc and initial value of the global redux state, which correspond to the working space in memory
export const initialState = ()=>({
    docs: new Map(), // currently loaded docs
    doc: {payload: {}}, // current doc (in the URL or form view)
    selection: [], // uuids
    loading: '', // main data is loading
    allowSelection: !isMobile(),
    menu: {
        open: isLaptop(),
        docked: !isMobile(),
    },
    device: getDevice(), // 'mobile', 'tablet' or 'laptop'
    layouts: {...initialLayouts}, // model: layouts
});

export function doc(doc=initialState().doc, action) {
    switch (action.type) {
        case 'CHANGE_FIELD':
            return {...doc, payload: {...doc.payload, [action.payload.name]: action.payload.value}};
        case 'SET_FORM_DATA':
            return action.payload !== doc ? {...action.payload} : doc;
        case 'CLEAR_FORM_DATA':
            return Object.keys(doc).length ? {...action.payload} : doc;
        default:
            return doc;
    }

}

function menu(menu=initialState().menu, action) {
    switch (action.type) {
        case 'OPEN_MENU':
            return menu.open ? menu : {...menu, open: true};
        case 'CLOSE_MENU':
            return menu.open ? {...menu, open: false} : menu;
        case 'TOGGLE_MENU':
            return {...menu, open: !menu.open, floating: !isLaptop(action.payload.innerWidth)};
        default:
            return menu;
    }
}

export function docs(docs=initialState().docs, action) {
    const {payload} = action;
    let newdocs;
    switch(action.type){
        case 'ADD_DOC':
            newdocs = new Map(docs);
            newdocs.set(payload.uuid, payload);
            return newdocs;
        case 'LOAD_DOCS':
            return payload !== docs ? new Map(payload) : docs;
        case 'DOC_STATUS':
            if (docs.get(payload.uuid).status === payload.status) return docs;
            newdocs = new Map(docs);
            newdocs.set(payload.uuid, {...docs.get(payload.uuid), status: payload.status})
            return newdocs;
        case 'CLEAR_DOCS':
            return docs.size ? initialState().docs : docs;
        case 'REMOVE_DOC':
            if (!docs.has(payload)) return docs;
            newdocs = new Map(docs);
            newdocs.delete(payload);
            return newdocs;
        default:
            return docs;
    }
}

export function loading(loading=initialState().loading, action) {
    switch(action.type){
        case 'LIST_STATUS':
            return action.payload === loading ? loading : action.payload;
        default:
            return loading;
    }
}

export function allowSelection(allowSelection=initialState().allowSelection, action) {
    switch(action.type) {
        case 'TOGGLE_SELECT_COLUMN':
            return !allowSelection;
        default:
            return allowSelection;
    
    }
}

export function selection(selection=initialState().selection, action) {
    switch(action.type) {
        case 'TOGGLE_SELECT_ROW':
            if (selection.indexOf(action.payload)>=0)
                return selection.filter(u=>u!==action.payload);
            return [...selection, action.payload];
        default:
            return selection;
    }
}

export function layouts(layouts=initialState().layouts, action) {
    const {payload} = action;
    switch(action.type) {
        case 'CHANGE_LAYOUT':
            if (payload.layouts === layouts[payload.model]) return layouts;
            return {...layouts, [payload.model]: payload.layouts}
        default:
            return layouts;
    }
}

export function device(device=initialState().device, action) {
    switch (action.type) {
        case 'CHANGE_DEVICE':
            return action.payload;
        default:
            return device;
    }
}

export const globalreducer = combineReducers(
    {device, routing: routerReducer, doc, docs, selection, menu, loading, allowSelection, layouts});
