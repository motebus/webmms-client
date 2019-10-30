# webmms-client

- **Get the webmms instance**

  ``` javascript
  import webmms from 'webmms'
  let mms = webmms()
  ```

  - `webmms(option)`
    
    | param    | type                 |
    | -------- | -------------------- |
    | option   | `Object`             |
    | option.wsurl   |  `String`      |
    | option.EiToken | `String`       |
    | option.SToken  | `String`       |


- **Methods**

  - `on(name, callback)`

    | param    | type                 |
    | -------- | -------------------- |
    | name     | `any` (required)     |
    | callback | `function`(required) |

    Returns a function to release the listener.

    ``` javascript
    let releaseListener = mms.on('hello', name => console.log(`hello ${name}`))
    
    releaseListener() // releases the listener
    ```

  - `emit(name[,args])`

    | param | type                          |
    | ----- | ----------------------------- |
    | name  | `any` (required)              |
    | args  | any number of values of `any` |

    Returns an array with every return value for each on callback.

    ``` javascript
    const o1 = mms.on('someEvent', () => 1)
    const o2 = mms.on('someEvent', () => 2)
    const o3 = mms.on('someEvent', () => true)
    const result = mms.emit('someEvent')  // > [ 1, 2, true] 
    ```

  - `sendMMS({ topic, DDN, payload })`

    | param   | type                         |
    | ------- | ---------------------------- |
    | topic   | `string` (required)          |
    | DDN     | `string` (required)          |
    | payload | `Object | String` (required) |

    Returns the reply

    ```javascript
    let reply = await mms.sendMMS({
        topic: 'ss://ylobby',
        DDN: '',
        payload: 'notify Hello 60 red 3'
    })
    ```

  - `callMMS({ topic, DDN, func, payload })`

    | param   | type                        |
    | ------- | --------------------------- |
    | topic   | `string` (required)         |
    | DDN     | `string` (required)         |
    | func    | `string`(required)          |
    | payload | `Object | String`(required) |

    Returns the reply

    ``` javascript
    let reply = await mms.callMMS({
        topic: 'jLobby',
        DDN: '',
        func: 'echo',
        payload: { data: 'Hello MMS' }
    })
    ```

  - `nearby()`

    Returns the nearby result

    ``` javascript
    let reply = await mms.nearby()
    ```

  - `getDeviceInfo()`

    ``` javascript
    let deviceInfo = await mms.getDeviceInfo()
    ```

  - `setDeviceInfo(deviceInfo)`

    ``` javascript
    let deviceInfo = {
        DDN: '',
        EiOwner: '',
        EiName: 'eiHello',
        EiType: '.mc',
        EiTag: '#hello',
        EiLog: ''
    }
    
    let result = await mms.setDeviceInfo(deviceInfo)
    ```

  - `getAppSetting()`

    ```javascript
    let result = await mms.getAppSetting()
    ```

- **Deal the mms event**

  ```javascript
  // while register to dc successfully, emit the 'registered' signal
  mms.on('registered', reply => {
      // do something
  })
  
  // while get the message, emit the 'message' signal
  mms.on('message', (method, from, data, ack) => {
      // do something
  })
  
  mms.on('state', msg => {
      // do something
  })
  
  mms.on('disconnect', msg => {
      // do something
  })
  
  mms.on('error', err => {
      // do something
  })
  
  mms.on('connect_error', err => {
      // do something
  })
  
  mms.on('connect_timeout', err => {
      // do something
  })
  ```
