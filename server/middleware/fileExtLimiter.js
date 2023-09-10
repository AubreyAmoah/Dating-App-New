const path = require('path');

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files;

        const fileExtentions = [];
        Object.keys(files).forEach(key => {
            fileExtentions.push(path.extname(files[key].name))
        })

        const allowed = fileExtentions.every(ext => allowedExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.includes.toString()} files allowed.`.replace(",", ", ");

            return res.status(422).json({ success: 0, message });
        }

        next()
    }
}

module.exports = fileExtLimiter