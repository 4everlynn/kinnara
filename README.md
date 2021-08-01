![](https://img.shields.io/badge/fatewajs-Kinara-red?style=for-the-badge&logo=typescript&labelColor=black) ![](https://img.shields.io/badge/npm-v1.0.1-orange?style=for-the-badge&logo=npm&labelColor=black)  ![](https://img.shields.io/badge/gitpod-try!-gold?style=for-the-badge&logo=gitpod&labelColor=black)


### Kinnara

> Imagine the past API access methods, complex, repeated redundant code, scattered modules,
> long-term maintenance Code accumulation is difficult to solve, 
> today Kinnara is born to solve such problems


### Install


Before we start, let’s review a little bit.  
Under normal circumstances, our management of the API path

### 1. Write-on-use (no management)

```js
// Write path when using
// noinspection JSAnnotator
const api = '{HOST}/hydra/info'

(async () => {
    const response = await axios.get({
        url: api
    })
})()

```

&nbsp;&nbsp;&nbsp;&nbsp;Obviously, this method is extremely undesirable.   
It will make the API version difficult to manage.   
Once the API version is upgraded,   
the paths are scattered in various code files.   
It is very difficult to modify, and it is easy to miss and make mistakes.   
This method is Highly not recommended  



### 2. Centralized routing management

&nbsp;&nbsp;&nbsp;&nbsp;In this mode, two files are usually required to cooperate with each other,   
one is `routing` and the other is `request`, 
let's take a look at this way.  
``
routing.js

```js
export const routing = {
    user: {
        info: '...'
    },
    cofing: '...'
}
```

request.js

```js
import routing from '@/api/routing.js'

const getUserInfo  = async (id) => {
   return axios({
        url: routing.user.info
    })
}
```

&nbsp;&nbsp;&nbsp;&nbsp;In this way, we can manage the API path and version well,      
but there will be a lot of duplicate code.     
&nbsp;&nbsp;&nbsp;&nbsp;There will be many copies of `request.js` and 90% of their composition is exactly the same.   
This looks so stupid.  

---

The good news is that with Kinnara, we don’t have to do this anymore.  
Let’s take a look at how the API is managed under Kinnara.  

```js
 // installation instructions
Kinnara.use(new JoinCommand())

const kinnara = new Kinnara()
// declare the api structure
const routing = {
    park: {
        settings: '/settings/param/page'
    }
}
// declare the proxy object
const proxy: any =
    kinnara
        // set up the http adapter
        .setHttpAdapter(new AxiosHttpAdapter(axios))
        .proxy(routing)

// directly use proxy object routing structure request interface
const response = await proxy.park.settings.get({
    query: {
        current: 1,
        size: 100
    }
})

// data structure
console.log(response.data)
```

&nbsp;&nbsp;&nbsp;&nbsp;Yes! We can directly reuse the routing structure to directly request the interface,    
and can support `custom instructions`, and provide a set of operation instructions by default.  
&nbsp;&nbsp;&nbsp;&nbsp;Believe me, using `Kinnara`, the API path is difficult to manage is a thing of the past.   

### What is the instruction

&nbsp;&nbsp;&nbsp;&nbsp;The URI that we declare in the path is often difficult to meet all situations,   
and we cannot avoid splicing.   
&nbsp;&nbsp;&nbsp;&nbsp;For this reason, Kinnara provides a command interface through which we can easily manipulate URL, headers and other attributes.

#### Basic environment

```js
 // installation instructions
Kinnara.use(new JoinCommand())

const kinnara = new Kinnara()

// declare the api structure
const routing = {
    park: {
        settings: '/settings'
    }
}

// declare the proxy object
const proxy =
    kinnara
        // set up the http adapter
        .setHttpAdapter(new AxiosHttpAdapter(axios))
        .proxy(routing)

```

#### Join

```js
const configId = 1

const response = proxy.park.settings
    .join`/single/${configId}`
    .get()


// Now we get URI /settings/single/1

```
#### head
```js
// Pass the request header parameter
const response = proxy.park.settings
  .head(
    {
      ContentType:'application/json',
      origin: 'https://xxx'
    }
  )
  .get()
```
#### replace

```js
// Replace a part of the url
const response = proxy.park.settings
  .replace({settings: 'newSettings'})
  .get()

// Now we get URI /newSettings
```
#### seq
```js
// Chain call instruction sequence
const resposne = proxy.park.settings
  .seq((chain) => {
    // chain provides all the instructions for the Kinnara library
    chain.join`/newParam`
    chain.replace({settings: 'newSettings'})
    chain.head({ContentType:'application/json'})
  })

// Now we get URI /newSettings/newParam
```
#### map
```js
// if the current instruction set does not meet your needs you can use the provided Map instruction
// Expose API parameters for users to perform custom operations
const resposne = proxy.park.settings
  .map((it:RequestWrapper) => it)
```

#### observe
```js
// Please look down for details
proxy.park.settings
  .observe(false)
  .get((response) => {
    // Original results returned by the server
    console.log(response)
})
```

### Kinnara provides an observer model

&nbsp;&nbsp;&nbsp;&nbsp;
Kinnara provides a Listen function when the URL is in the request state, so you can intercept or perform some additional request processing.

&nbsp;&nbsp;&nbsp;&nbsp; When you use, you can also use instructions to cancel the value returned by the function.
### How to Use
```js
// Listen to an API
kinnara.listen(routing.park.settings, (response) => {
  // do anything you want
  return {
    response,
    edward: 'You Will See This'
  }
})

// After the listener
proxy.park.settings.get((response) => {
  const { response, edward } = response
})

// Use the observe instruction to cancel the return result of the listening function
proxy.park.settings
  .observe(false)
  .get((response) => {
    // Original results returned by the server
    console.log(response)
})
```
