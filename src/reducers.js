import { combineReducers } from 'redux'
import {
    UPDATE_SOCK_STAT,
    REG_TO_CENTER
} from './actions'

function sockStat(state = false, action) {
    switch (action.type) {
        case UPDATE_SOCK_STAT:
            return action.isConnected
        default:
            return state
    }
}

function mms(state = {}, action) {
    switch (action.type) {
        case REG_TO_CENTER:
            return {
                EiToken: action.EiToken,
                SToken: action.SToken,
                UToken: action.UToken
            }
        default:
            return state
    }
}

const reducers = combineReducers({
    sockStat,
    mms
})

export default reducers