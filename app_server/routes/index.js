var express = require('express');
var router = express.Router();
var ctrlLocation = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* Страницы местоположеий */
// router.get - ИЩЕТ запрос GET по пути URL домашней страницы - '/'
router.get('/', ctrlLocation.homelist);
router.get('/location/:locationid', ctrlLocation.locationInfo);
router.get('/location/review/new', ctrlLocation.addReview);

router.get('/about', ctrlOthers.about);

module.exports = router;
