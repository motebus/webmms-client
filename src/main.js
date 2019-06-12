import axios from 'axios'
import { createStore } from 'redux'
import io from 'socket.io-client'
import reducers from 'reducers'
import { updateSockStat, regToCenter } from 'actions'

const getipurl = 'https://env.ypcloud.com/getwip'
const waitForWIP = () => axios({
    method: 'get',
    url: getipurl,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    timeout: 5000
})

const mmserr = {
    "OK": { "code": 0, "msg": "OK" },
    "InvalidData": { "code": -10501, "msg": "ms: Invalid data" },
    "InvalidCmd": { "code": -10502, "msg": "ms: Invalid command" },
    "NullSToken": { "code": -10503, "msg": "ms: SToken error" },
    "DCNotConn": { "code": -10504, "msg": "ms: DC not link" },
    "NullCmd": { "code": -10505, "msg": "ms: Blank cmd" }
}

Object.freeze(mmserr)

function createMMS({ wsurl = 'https://lib.ypcloud.com' } = {}) {
    let webmms = {
        events: new Map([]),

        store: createStore(reducers, {
            sockStat: false,
            mms: { EiToken: '', SToken: '', UToken: '' }
        }),

        socket: io(wsurl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        }),

        on(name, cb) {
            this.events.set(name, [...(this.events.get(name) || []), cb])
            return () => this.events.set(name, this.events.get(name).filter(fn => fn !== cb))
        },

        emit(name, ...args) {
            return this.events.has(name) && this.events.get(name).map(fn => fn(...args))
        },

        sendMMS({ topic, DDN, payload } = {}) {
            let { sockStat } = this.store.getState()
            if (!sockStat) return Promise.reject('websocket not ready')

            return Promise(resolve => {
                this.socket.emit('request', {
                    func: 'send',
                    body: { topic, DDN, data: payload }
                }, function (reply) { resolve(reply) })
            })
        },

        callMMS({ topic, DDN, func, payload } = {}) {
            let { sockStat } = this.store.getState()
            if (!sockStat) return Promise.reject('websocket not ready')

            return Promise(resolve => {
                this.socket.emit('request', {
                    func: 'call',
                    data: { topic, DDN, func, args: payload }
                }, function (reply) { resolve(reply) })
            })
        },

        nearby() {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })
            
            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'nearby',
                    data: { SToken }
                }, function (reply) { resolve(reply) })
            })
        },

        getDeviceInfo() {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })

            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'getinfo', data: { SToken }
                }, function (reply) { resolve(reply) })
            })
        },

        setDeviceInfo(deviceInfo) {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })

            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'setinfo',
                    data: { SToken, EdgeInfo: deviceInfo }
                }, function (reply) { resolve(reply) })
            })
        },

        getAppSetting() {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })

            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'getapp', data: { SToken }
                }, function (reply) { resolve(reply) })
            })
        },

        setAppSetting(setting) {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })

            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'setapp',
                    data: { SToken, Setting: JSON.stringify(setting) }
                }, function (reply) { resolve(reply) })
            })
        },

        getQPin() {
            let { sockStat, mms } = this.store.getState()
            if (!sockStat) return Promise.reject({
                ErrCode: mmserr.DCNotConn.code,
                ErrMsg: mmserr.DCNotConn.msg
            })

            let { SToken } = mms
            if (!SToken) return Promise.reject({
                ErrCode: mmserr.NullSToken.code,
                ErrMsg: mmserr.NullSToken.msg
            })

            return new Promise(resolve => {
                this.socket.emit('request', {
                    func: 'getgpin', data: { SToken }
                }, function (reply) { resolve(reply) })
            })
        }
    }

    webmms.socket.on('connect', async function () {
        let { sockStat, mms } = webmms.store.getState()
        if (sockStat) return
        let { EiToken, SToken } = mms

        webmms.store.dispatch(updateSockStat({ isConnected: true }))
        let { data: wip } = await waitForWIP()
        webmms.wip = wip

        let payload = {
            func: 'regdc',
            data: { EiToken, SToken, WIP: wip }
        }

        webmms.socket.emit('request', payload, function (reply) {
            if (reply.ErrCode == mmserr.OK.code) {
                let { EiToken, SToken } = reply.result
                webmms.store.dispatch(regToCenter({
                    EiToken, SToken, UToken: ''
                }))
                webmms.dcStat = 'connected'
                webmms.emit('registered', reply)
            }
        })
    })

    webmms.socket.on('message', function (body, ack) {
        if (typeof body !== 'object') return

        let { method, inctl, data } = body
        let { From: from } = inctl
        webmms.emit('message', method, from, data, ack)
    })

    webmms.socket.on('state', function (msg) {
        webmms.emit('state', `motechat ${msg}`)
    })

    webmms.socket.on('reconnect', function () {
        let { sockStat, mms } = webmms.store.getState()
        if (sockStat) return
        let { EiToken, SToken } = mms

        webmms.store.dispatch(updateSockStat({ isConnected: true }))

        let payload = {
            func: 'regdc',
            data: { EiToken, SToken, WIP: webmms.wip }
        }

        webmms.socket.emit('request', payload, function (reply) {
            if (reply.ErrCode == mmserr.OK.code) {
                let { EiToken, SToken } = reply.result
                webmms.store.dispatch(regToCenter({
                    EiToken, SToken, UToken: ''
                }))
                webmms.dcStat = 'connected'
                webmms.emit('registered', reply)
            }
        })
    })

    webmms.socket.on('disconnect', function () {
        webmms.store.dispatch(updateSockStat({ isConnected: true }))
        webmms.emit('disconnect', 'websocket disconnect')
    })

    webmms.socket.on('error', function (err) {
        webmms.emit('error', err)
    })

    webmms.socket.on('connect_error', function() {
        webmms.emit('connect_error', 'websocket connect error')
    })

    webmms.socket.on('connect_timeout', function() {
        webmms.emit('connect_timeout', 'websocket connect timeout')
    })

    return webmms
}

export default createMMS