const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'}); // we have to configure our dotenv before app is require only then it is available in whole app in form of process.env

process.on('uncaughtException',err => {
    console.log('error due to uncaughtException ', err);
    console.log('UNCAUGHT EXCEPTION');
    process.exit(1);
})

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
    // .connect(process.env.DATABASE_LOCAL,{
    .connect(DB,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongoDB is connected'))

// const testTour = new Tour({
//     name: 'ladakh trakers',
//     price: 5000,
//     ratings: 4.9
// })
//
// testTour.save()
//     .then(doc => console.log(doc))
//     .catch(err => console.log(err))

//SERVER
const port = process.env.PORT || 3002;
const server = app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})

// whenever there is any unhandled promise rejection, process emits an event name unhandledRejection
process.on('unhandledRejection', err => {
    console.log('error',err.name, err.message);
    console.log('UNHANDLED REJECTION, APP IS GOING TO SHUTDOWN....')
    server.close(() => {
        process.exit(1);
    })
})