
// check req.body for add tour middleware
exports.checkTourBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(404).json({
            success: false,
            message: "not found"
        })
    }
    next()
}

//checkId - param   middleware
exports.checkId = (req,res,next,val) => {
    console.log('Tour id is : ' , val, typeof val);
    // if(val * 1 > tours.length){
    //     return res.status(404).json({
    //         success : false,
    //         message : 'Invalid id'
    //     })
    // }
    next();
}

//get all tours
exports.getAllTours = (req,res) => {
    res.status(200).json({
        success : true,
        createdAt: req.createdAt,

    })
}

// get one tour
exports.getOneTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;  // if str is multiply by no. it converted in number
    // const tour = tours.find(el => el.id === id);

    res.status(200).json({
        success : true,
        data : {
            // tour
        }
    })
}

// add one tour
exports.addOneTour = (req,res) => {

}

// update one tour
exports.updateOneTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;  // if str is multiply by no. it converted in number

}


// delete one Tour
exports.deleteOneTour =  (req,res) => {
    const id  = req.params.id * 1;
    console.log(id)

}
