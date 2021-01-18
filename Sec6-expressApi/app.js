const fs = require('fs');
const express = require('express');

const app = express();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))

app.get('/api/v1/tours',(req,res) => {
    res.status(200).json({
        success : true,
        payload : {
            tours,
            totalCount : tours.length
        }
    })
})

const port = 3002;
app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})
