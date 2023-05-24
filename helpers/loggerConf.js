const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console'},
        
        warnFile: { type: 'file', filename: 'warn.log'},

        errorFile: { type: 'file', filename: 'error.log'},

    },
    categories: {

        warn: { appenders: ['warnFile'], level:'info' },
        error: { appenders: ['errorFile', 'console'], level:'error' },
        default: { appenders: ['console'], level:'trace' }

    }
});

const loggerDefault = log4js.getLogger();
const loggerError = log4js.getLogger('error');
const loggerWarn = log4js.getLogger('warn');


module.exports = { loggerDefault, loggerError, loggerWarn };
