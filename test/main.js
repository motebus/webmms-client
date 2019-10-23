import webmms from '../dist/bundle'
import publicIp from 'public-ip'
import { text, mount } from 'redom'
import { set as setCookie, get as getCookie } from 'es-cookie'

publicIp.v4().then(console.log)

let EiToken = getCookie('EiToken') || ''
let SToken = getCookie('SToken') || ''
console.log({ EiToken, SToken })

let mms = webmms({ EiToken, SToken })

mms.on('registered', reply => {
    console.log(reply)
    let { result: { DDN, EiToken, SToken } } = reply
    let id = 0
    // document.getElementById('DDN').innerText = `DDN: ${DDN}`
    setCookie('EiToken', EiToken, { expires: 7, path: '' })
    setCookie('SToken', SToken, { expires: 7, path: '' })

    setInterval(async () => {
        await mms.sendMMS({
            topic: '',
            DDN: DDN,
            payload: `Hello webmms! ${id++}`
        })
    }, 3000)


    // mms.on('message', (method, from, data, ack) => {
    //     document.getElementById('message').innerText = `
    //         method: ${method}
    //         from: ${JSON.stringify(from)}
    //         data: ${data}
    //         ack: ${ack}
    //     `
    // })

    mms.on('state', state => console.log(state))
})