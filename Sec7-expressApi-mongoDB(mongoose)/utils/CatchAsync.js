// It's used to handle all async error to avoid try catch block

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


// Here fn is async function which returns promise that's why we can use catch to get error.
// So, try catch is block is excluded and we wrapped all the async function inside catchAsync.
