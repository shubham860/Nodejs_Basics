const app = require('./app');

//SERVER
const port = 3002;
app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})
