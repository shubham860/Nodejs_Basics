const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const toursModel = require('../models/tourModels');


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

console.log(Tours);

// IMPORT DATA
const importData = async () => {
    try{
        await toursModel.create(Tours);
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
