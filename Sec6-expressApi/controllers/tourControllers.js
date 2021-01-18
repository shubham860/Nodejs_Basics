const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`));

//get all tours
exports.getAllTours = (req,res) => {
    res.status(200).json({
        success : true,
        createdAt: req.createdAt,
        data : {
            tours,
            totalCount : tours.length
        }
    })
}

// get one tour
exports.getOneTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;  // if str is multiply by no. it converted in number
    const tour = tours.find(el => el.id === id);


    if(!tours){
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
exports.addOneTour = (req,res) => {
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

exports.updateOneTour = (req,res) => {
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

exports.deleteOneTour =  (req,res) => {
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
