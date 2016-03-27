export const EM = typeof window !== 'undefined' ? /* typeof is for mocha */
    Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]) : 768;
export const isMobile = (width=window.innerWidth) => width < 48*EM;
export const isTablet = (width=window.innerWidth) => width >= 48*EM && width < 75*EM;
export const isLaptop = (width=window.innerWidth) => width >= 75*EM;
export const getDevice = () => isMobile() ? 'mobile' : isLaptop() ? 'laptop': 'tablet';

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

export function changeDevice (device) {
    console.log('action: CHANGE_DEVICE');
    return {
        type: 'CHANGE_DEVICE',
        payload: device
    }
}
