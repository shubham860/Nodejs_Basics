const fs = require('fs');
const server = require('http').createServer();

server.on('request',(req,res) => {

    // solution-1 : read file async
    // fs.readFile(`${__dirname}/files/test-file.txt`,(err,data) => {
    //     res.end(data);
    // })
    // conclusion : it loads file in memory at once which make process slow


    // solution-2: using streams
    // const readableData = fs.createReadStream(`${__dirname}/files/test-file.txt`);
    // readableData.on('data', chunck => {
    //      res.write(chunck)
    // })
    //
    // readableData.on('end', () => {
    //     res.end();
    // })
    //
    // readableData.on("error", err => {
    //   console.log(err);
    //   res.statusCode = 500;
    //   res.end("File not found!");
    // });
    // conclusion: it creates the probllem of back pressure (stream read data from file so fast but res cannot send it over the n/w with same speed


    //Solution-3:  using pipe method of readable stream to control back pressure

    const readableData = fs.createReadStream(`${__dirname}/files/test-file.txt`);
    readableData.pipe(res);
})


server.listen(3002, () => {
    console.log('server is running on 3002');
})