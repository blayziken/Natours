module.exports = fn => {
    return (req, res, next) => {
        console.log('Here in catchAsyncError block');
        fn(req, res, next).catch(next);
    }
}   