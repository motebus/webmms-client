/*
 *  action types
 */

export const REG_TO_CENTER = 'REG_TO_CENTER'
export const UPDATE_SOCK_STAT = 'UPDATE_SOCK_STAT'

/*
 *  action creators
 */

export function regToCenter({ EiToken = '', SToken = '', UToken = '' }) {
    return {
        type: REG_TO_CENTER,
        EiToken, SToken, UToken 
    }
}

export function updateSockStat({ isConnected = false }) {
    return {
        type: UPDATE_SOCK_STAT,
        isConnected
    }
}