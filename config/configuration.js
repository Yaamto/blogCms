module.exports = {
    mongoDbUrl : 'mongodb+srv://bilal:bilal@cluster0.s3svh.mongodb.net/cmstest',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        next();
    },


};
