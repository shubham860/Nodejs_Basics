const http = require('http');

const server = http.createServer((req,res) => {
    res.end('Greetings from the server');
})


server.listen(3002,'127.0.0.1',() => {
 console.log('Listening to port 3002');
})


// in listen() hostname is optional for localhost