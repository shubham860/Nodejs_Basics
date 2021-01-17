// SHIPPED MODULES (built-in/core modules)
const http = require('http');
const url = require('url'); // for using the current url of browser
const fs = require('fs');

//OWN MODULE
const templateFiller = require(`./modules/templateFiller.js`);

// 3rd party modules
const slugify = require('slugify');

//API DATA FILE
const fileData = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const data = JSON.parse(fileData);

// reading each templates
const cardsTemp = fs.readFileSync(`${__dirname}/templates/cards.html`, 'utf-8');
const overviewTemp = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemp = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');


const server = http.createServer((req, res) => {
    // let pathName = req.url; // current url of browser
    const {query, pathname} = url.parse(req.url, true);
    const slugs = data.map(el => slugify(el.productName, {lower: true}));
    console.log('slugs', slugs);

    switch (pathname) {
        case '/':
        case '/overview':
            res.writeHead(200, {'Content-type': 'text/html'})
            const cardsHtml = data.map(el => templateFiller(cardsTemp, el)).join('');
            const overviewHtml = overviewTemp.replace(/{%productsCards%}/, cardsHtml);
            res.end(overviewHtml);
            break;


        case '/product':
            res.writeHead(200, {'Content-type': 'text/html'})
            const productData = data[query.id];
            const productHtml = templateFiller(productTemp, productData);
            res.end(productHtml);
            break;

        case '/farm-products':
            res.writeHead(200, {
                'Content-type': 'application/json'
            })
            res.end(fileData);


        default :
            res.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-content': "I'm shubham",
            })
            res.end("<h1>Page not found</h1>");
    }

})


server.listen(3002, '127.0.0.1', () => {
    console.log('Listening to port 3002');
})


