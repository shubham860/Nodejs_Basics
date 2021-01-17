const fs = require('fs');

const fileData = fs.readFileSync('./file.txt','utf-8');
console.log('file Data is -',fileData);


const newDataForFile = `${fileData}, created on ${Date.now()}`;
fs.writeFileSync('./output.txt',newDataForFile);
console.log('File writting succesfuuly');