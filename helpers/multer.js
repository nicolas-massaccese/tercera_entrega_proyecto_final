const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        // cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
        cb("", "avatar" + "." + mimeTypes.extension(file.mimetype));
    },
});

const maxSize = 1 * 1024 * 1024 // 1MB

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Solo se permiten subir archivos en formato .png, .jpg y .jpeg'));
        }
    },
    limits: { fileSize: maxSize }
});

module.exports = {upload};