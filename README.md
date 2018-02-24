# teamspeak-query [![npm version](https://badge.fury.io/js/teamspeak-query.svg)](https://badge.fury.io/js/teamspeak-query)
A small library which exposes an API to talk to your Teamspeak-Server via the [Teamspeak-ServerQuery](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf)

# Installation
```shell
$ npm install teamspeak-query
```

# Example
```javascript
const TeamspeakQuery = require('teamspeak-query');
const query = new TeamspeakQuery('127.0.0.1', 10011);

query.send('login', 'serveradmin', 'changeme')
	.then(() => query.send('use', 1))
	.then(() => query.send('servernotifyregister', { 'event': 'server' }))
	.then(() => console.log('Done! Everything went fine'))
	.catch(err => console.error('An error occured:', err));

// After teamspeak has processed 'servernotifyregister' we will get notified about any connections
query.on('cliententerview', data =>
	console.log(data.client_nickname, 'connected') );
```

## Constructor
The constructor takes 3 parameters  

| Name    | Default     | Description                                     |
| ------- | ----------- | ----------------------------------------------- |
| host    | `127.0.0.1` | The ip of the server                            |
| port    | `10011`     | The query port of the server                    |
| options | `{ }`       | Any options that should be passed to the socket |

**INFO**: The raw socket can be accessed via the instance's `sock` property.


## Methods
#### TeamspeakQuery.send(cmd, params?, ...flags?)
Sends a command to the server and returns a Promise that resolves to or rejects with the value returned by `TeamspeakQuery#parse`.  

There are 2 ways, which can also be mixed, to specify parameters for the command:
* **params**: An object, e.g. `{ 'parameter': 'value', 'x': 42 }`.
* **flags**: Plain arguments passed to the function, e.g. `query.send('login', 'username', 'password')`.  
You can also use it to set flags, e.g. `query.send('clientlist', '-uid')`.

If you want your response to be an array, e.g. for commands like `clientlist`, take a look at [Issue #3](https://github.com/schroffl/teamspeak-query/issues/3#issuecomment-359252099).

#### TeamspeakQuery#parse(str)
Parses a response string and returns an object that contains the type of the response (error, notification, etc.) together with its parameters.
The `raw` function of the returned object can be called to acquire the plaintext that was passed to the function.

#### TeamspeakQuery#escape(str)
Escape a string according to [the specification](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf#page=5).

#### TeamspeakQuery#unescape(str)
Unescape a string according to [the specification](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf#page=5).

## Throttling
Commands are being throttled by default if the host is not set to the local machine (`127.0.0.1` or `localhost`) in order to prevent a ban for flooding (see [Whitelisting and Blacklisting](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf?#page=6) in the specs).  
The instance of [lib/throttle.js](lib/throttle.js) can be accessed via `TeamspeakQuery.throttle`.  
If you want to disable throttling, you can do it like this: `TeamspeakQuery.throttle.set('enable', false)`.