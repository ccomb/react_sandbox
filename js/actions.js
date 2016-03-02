// XS media width is 48 * 'em' size in pixels // typeof is for mocha
export const EM = typeof window !== 'undefined' ? 
    Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const XS = 48*EM;
export const MD = 62*EM;


export function openMenu() {
    return {
        type: 'OPEN_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function closeMenu() {
    return {
        type: 'CLOSE_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function toggleMenu() {
    return {
        type: 'TOGGLE_MENU',
        payload: {
            innerWidth: window.innerWidth
        }
    };
}

export function toggleSelectColumn() {
    console.log('action: toggleSelectColumn');
    return {
        type: 'TOGGLE_SELECT_COLUMN'
    }
}
