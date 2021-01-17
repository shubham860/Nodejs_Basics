const fs = require('fs');

fs.readFile('./file.txt','utf-8',(err,data) => {
    console.log('data is -', data);
});
console.log('will read file after me.')

fs.readFile('./file.txt','utf-8',(err,data) => {
   fs.writeFile(`./${Date.now()}.txt`,`Hello my name is ${Date.now()} and i'm carrying ${data} of file.txt`,err => {
       console.log('err',err);
   })
});