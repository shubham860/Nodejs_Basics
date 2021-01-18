const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

//get all tours
const getAllTours = (req,res) => {
    res.status(200).json({
        success : true,
        data : {
            tours,
            totalCount : tours.length
        }
    })
}

// get one tour
const getOneTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;  // if str is multiply by no. it converted in number
    const tour = tours.find(el => el.id === id);


    if(!tours || tours.length < id ){
        return res.status(404).json({
            success : false,
            message : 'Invalid id'
        })
    }
    res.status(200).json({
        success : true,
        data : {
            tour
        }
    })
}

// add one tour
const addOneTour = (req,res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);

    // console.log(req.body);
    fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours), err => {
        if(err) return res.status(500).json({success : false});
        res.status(201).json({
            success: true,
            data : {
                newTour
            }
        })
    })
}

// update one tour

const updateOneTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;  // if str is multiply by no. it converted in number

    if(!tours || tours.length < req.params.id * 1 ){
        return res.status(404).json({
            success : false,
            message : 'Invalid id'
        })
    }

    tours.map((el,index) => {
        if(el.id === id){
            tours[index] = Object.assign(el, req.body);
        }
    });

    fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours), err => {
        if(err) return res.status(500).json({success : false});
        res.status(201).json({
            success: true,
            data : {}
        })
    })
}


// delete one Tour

const deleteOneTour =  (req,res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            success : false,
            message : 'Invalid id'
        })
    }
    const id  = req.params.id * 1;
    console.log(id)
    tours.map((el,i) => {
        if(el.id === id){
            tours.splice(i,1)
        }
    });

    fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours), err => {
        if(err) return res.status(500).json({success : false});
        res.status(204).json({
            success: true,
            data : {}
        })
    })
}


app.route('/api/v1/tours')
    .get(getAllTours)
    .post(addOneTour)

app.route('/api/v1/tours/:id')
    .get(getOneTour)
    .patch(updateOneTour)
    .delete(deleteOneTour)

const port = 3002;
app.listen(port, () => {
    console.log(`server is running on ${port} port`);
})
