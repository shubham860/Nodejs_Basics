const http = require('http');
const url = require('url'); // for using the current url of browser

const server = http.createServer((req,res) => {

    let pathName = req.url; // current url of browser

    switch (pathName){
        case '/':
        case '/overview':  res.end('Overview page ^_^');
                           break;
        case '/product':  res.end('product page');
                            break;
        default : res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-content': "I'm shubham",
        })
            res.end("<h1>Page not found</h1>");
    }

})


server.listen(3002,'127.0.0.1',() => {
    console.log('Listening to port 3002');
})


