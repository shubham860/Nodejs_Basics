class ApiFeatures{
    constructor(query, queryString) {
        this.query = query; // model.find()
        this.queryString = queryString // req.query
    }

    filtering(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','limit','fields']; // fields which are reserved for other work
        excludedFields.forEach(el => delete queryObj[el]);

        // 1(B) ADVANCE FILTERING - making query
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // {duration : {gte : 5}} ---> {duration : {$gte: 5}}

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' '); // for multiple sorting | /sort=price,duration convert -> price,duration to (price duration) for sort method
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt'); // default : always give data in ascemding order of date
        }

        return this;
    }

    limitingFields(){
        if(this.queryString.fields){
            const field =this.queryString.fields.split(',').join(' '); // duration convert -> price,duration to (price duration) for select method
            this.query = this.query.select(field);
        }else{
            this.query = this.query.select('-__v'); // minus to exclude __v from  response
        }

        return this;
    }

    pagination(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 1;
        const skip = (page - 1 ) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;