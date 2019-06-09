module.exports.homelist = function(req, res) {
    res.render('location-list', {title: 'Home'});
};

module.exports.locationInfo = function(req, res) {
    res.render('location-info', {title: 'Location Info'});
};

module.exports.addReview = function(req, res) {
    res.render('location-review-form', {title: 'Add review'});
};