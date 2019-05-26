var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
/* GET home page.  ПОЛУЧАЕМ GET - ДОМАШНЮЮ СТРАНИЦУ */
// router.get - ИЩЕТ запрос GET по пути URL домашней страницы - '/'
router.get('/', ctrlMain.index);

module.exports = router;
