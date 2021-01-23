const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour : {
        type: Boolean,
        default: false
    }
},
    {
        toJSON : { virtuals : true },
        toObject : { virtuals : true }
    }
)

tourSchema.virtual('durationWeeks').get(function (){
    return this.duration / 7 ;
})

//1(A) DOCUMENT MIDDLEWARE - pre : runs before .save() and .create mongoose methods only it has access to currently processing document
tourSchema.pre('save',function (next){
  this.slug  = slugify(this.name, {lower: true})
    next()
})

//1(B) DOCUMENT MIDDLEWARE - post : runs after .save() and .create mongoose methods only it give document after save
tourSchema.post('save',function (doc, next){
    console.log(doc)
    next()
})


//2(a) Query middleware -  pre - runs before query is executed on methos find and all types of find and this keyword reference to current query not document
tourSchema.pre(/^find/, function (next){
    this.find({secretTour : {$ne : true}}) // .find is method on query
    this.start = Date.now();
    next()
})

//2(a) Query middleware -  post - runs after query is executed on methos find and all types of find and this keyword reference to current query not document
tourSchema.post(/^find/, function (doc,next){
    console.log(`Query took ${Date.now() - this.start} ms`)
    next()
})


// 3(a) Agreegation middleware - pre - run befor any aggregation and this reference to current agggreation document
tourSchema.pre('aggregate', function (next){
    this.pipeline().unshift({$match : {secretTour : {$ne : true}}}) // we have to add another match which exclude secret tour true document
    next()
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;