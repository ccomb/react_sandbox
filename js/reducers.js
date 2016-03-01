import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {MD} from './actions';
import {listview} from './listview/reducers';
import {formview} from './formview/reducers';

// Doc and initial value of the global redux state, which correspond to the working space in memory
export const initialState = {
    listview: {
        // displayed docs
        docs: [],
        selectedUuids: [],
        docStatus: {}, // keys are uuids
        listStatus: '',
        selectColumn: (()=> window.innerWidth >= MD ? true : false)(),
    },
    menu: {
        open: (()=> window.innerWidth <= MD ? false : true)(),
        floating: (()=> window.innerWidth < MD ? true : false)()
    },
    formview: {
        // data of the currently displayed object
        data: {
            payload: {},
        },
        // layout of the fields and widgets
        layout: {},
    }
}

function menu(menu=initialState.menu, action) {
    switch (action.type) {
        case 'OPEN_MENU':
            return menu.open ? menu : {...menu, open: true};
        case 'CLOSE_MENU':
            return menu.open ? {...menu, open: false} : menu;
        case 'TOGGLE_MENU':
            return {...menu, open: !menu.open, floating: action.payload.innerWidth<MD};
        default:
            return menu;
    }
}


export const globalreducer = combineReducers(
    {routing: routerReducer, formview, menu, listview});
