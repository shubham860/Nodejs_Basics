const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const toursModel = require('../models/tourModels');
const reviewModel = require('../models/reviewModal');
const userModel = require('../models/userModels');


dotenv.config({path: '../config.env'});


const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongoDB is connected'))

const Tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const Reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));
const Users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));

console.log(Tours);

// IMPORT DATA
const importData = async () => {
    try{
        await toursModel.create(Tours);
        await reviewModel.create(Reviews);
        await userModel.create(Users, {validateBeforeSave: false});

        console.log('Data successfully loaded!');
    }catch (e){
        console.log('err',e)
    }
    process.exit();
}


// DELETE DATA
const deleteData = async () => {
    try{
        await toursModel.deleteMany();
        await reviewModel.deleteMany();
        await userModel.deleteMany();

        console.log('Data deleted loaded!');
    }catch (e){
        console.log('err',e)
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete') {
    deleteData()
}
