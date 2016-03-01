
export function changeField(field) {
    return {
        type: 'CHANGE_FIELD',
        payload: {
            name: field.name,
            value: field.value
        }
    }
}

export function clearFormData() {
    console.log('action: CLEAR_FORM_DATA');
    return {
        type: 'CLEAR_FORM_DATA',
        payload: null,
    }
}

export function setFormData(doc) {
    console.log('action: SET_FORM_DATA', doc);
    return {
        type: 'SET_FORM_DATA',
        payload: doc,
    }
}
