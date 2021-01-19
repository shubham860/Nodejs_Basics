const dotenv = require('dotenv');
dotenv.config({path: './config.env'}); // we have to configure our dotenv before app is require only then it is available in whole app in form of process.env
const app = require('./app');

//SERVER
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})
