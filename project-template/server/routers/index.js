const api = require('./api');
// const {router} = require('express');
// const router = require('exporess');
const express = require('express');
const router = express.Router();

module.exports = function(App){
    router.use('/api/', api);
    return router;
}