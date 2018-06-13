var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function (request, response, next) {
    var filename = request.query.filename || null;

    if (filename === null) {
        response.statusCode = 404;
        response.send();

        return;
    }

    response.setHeader("Content-Type", "application/msword");
    response.setHeader("Content-Disposition", "attachment;filename=" + filename);
    fs.createReadStream("./data/file.doc").pipe(response);
});

module.exports = router;
