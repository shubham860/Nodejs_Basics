const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModels');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have length less then equals to 40'],
        minlength: [5, 'A tour name must have length more then equals to  5'],
        validator : [validator.isAlpha, 'Tour must contains only numbers']
    },

    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['difficult','easy','medium'],
            message: 'A difficulty must includes difficult,easy, medium '
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'ratings must be less then equals to 5'],
        min: [1, 'ratings must be greater then equals to 1']
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
        type: Number,
        validate : {
            validator : function (value){
                return value < this.price
            }
        },
        message : 'price discount ({VALUE}) should be less then price'
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
    },

    startLocations: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String
    },

    locations: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    },

    // guides: Array // Embedding - it contains ids of users as a guide
    guides : [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ] // for child refrencing
},
    {
        toJSON : { virtuals : true },
        toObject : { virtuals : true }
    }
)

// for improving reading performance we use indexing because n mongo ids is stored uniquely
tourSchema.index({price: 1, ratingsAverage: -1}); // 1,-1 for ascending , descending respectively
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });


tourSchema.virtual('durationWeeks').get(function (){
    return this.duration / 7 ;
})

// VIRTUAL POPULATE - for showing review of particular tour
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

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

// // Document middleware - to get all the user from User model from as a guide by Id.
// tourSchema.pre('save', async function(next){
//     const guidePromise = this.guides.map(async id => User.findById(id)); //  it will return a array of promises to resolve them use promise.all()
//     this.guides = await Promise.all(guidePromise);
//     next()
// })


//2(a) Query middleware -  pre - runs before query is executed on methos find and all types of find and this keyword reference to current query not document
tourSchema.pre(/^find/, function (next){
    // this.find({secretTour : {$ne : false}}) // .find is method on query
    this.start = Date.now();
    next()
})

// Query middleware for child refrencing to populate tour guides data into tours
tourSchema.pre(/^find/,function (next){
    console.log("i'm running")
    this.populate({path: 'guides', select: '-__v -passwordChangedAt'}); //  this.populate('guides');
    next();
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