const eventEmitter = require('events');
const http = require('http');

class Sales extends eventEmitter{
    constructor() {
        super();
    }
}

const myEmitter = new Sales(); // we can directly do that without class | const myEmitter = new eventEmitter();

myEmitter.on('sale',() => {
    console.log('sale is started');
})

myEmitter.on('sale',(stock) => {
    console.log(`stock left : ${stock}`);
})


myEmitter.emit('sale',9);


const server = http.createServer();

server.on('request',(req,res) => {
    console.log('request received',req.url);
    res.end('request received');
})

server.listen(3003, () => console.log('server is listening'))