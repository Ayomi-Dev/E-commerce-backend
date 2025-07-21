import multer from 'multer'
import path from 'path'


const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads/'); //this defines where to save the uploaded image file
    },
    filename(req, file, callback) {
        callback(
            null,
            `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`        )
    },
});

export const upload = multer({ storage })