const { logger } = require('./loggerConf');

function isAuthenticated(req, res, next) {

    if(req.isAuthenticated()){
        return next()
    }else{
        logger.warn();('errorMsg', 'Not authorized');
        req.flash('errorMsg', 'Not authorized');

        res.redirect('/');
    }
};

module.exports = {isAuthenticated};