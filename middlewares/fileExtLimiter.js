const path = require('path');

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
         const files = req.files;
         const fileExtensions = [];
         Object.keys(files).forEach(key => {
            const a = fileExtensions.push(path.extname(files[key].name))
         })
       
         const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))
   
         if (!allowed) {
            const message = `Uploaded failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(',', ', ');
            return res.status(422).json({status: 422, message})
         }
         next();
    }   
}
module.exports = fileExtLimiter; 