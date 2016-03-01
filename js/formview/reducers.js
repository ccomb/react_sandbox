import {initialState} from '../reducers';

export function formview(formview=initialState.formview, action) {
    switch (action.type) {
        case 'CHANGE_FIELD':
            return {...formview,
                    data:{...formview.data, payload: {...formview.data.payload,
                    [action.payload.name]: action.payload.value}}};
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
