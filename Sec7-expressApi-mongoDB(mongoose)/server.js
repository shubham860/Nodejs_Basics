const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'}); // we have to configure our dotenv before app is require only then it is available in whole app in form of process.env
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
app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})
