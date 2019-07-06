var express = require('express');
var router = express.Router();
var ctrlLocation = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* Страницы местоположеий */
// router.get - ИЩЕТ запрос GET по пути URL домашней страницы - '/'
router.get('/', ctrlOthers.angularApp);
//router.get('/location/:locationid', ctrlLocation.locationInfo);
//router.get('/location/:locationid/reviews/new', ctrlLocation.addReview);
//router.post('/location/:locationid/reviews/new', ctrlLocation.doAddReview);

//router.get('/about', ctrlOthers.about);

module.exports = router;
