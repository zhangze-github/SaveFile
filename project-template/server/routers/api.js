const express = require('express');
const router = express.Router();
const {join} = require('path');

router.get('/test.json', function(req, res, next){
    res.sendFile(join(__dirname, '../data/paroductList.json'));
});

module.exports = router;