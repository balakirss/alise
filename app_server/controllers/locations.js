var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://balakirss.ru:3000";
}

var renderHomepage = function(req,res, responseBody){
    res.render('location-list',{
            title: 'Loc8r - find a place to work with wifi',
            pageHeader:{
                title:'Loc8r',
                strapline: 'Find places to work with wifi!'
            },
            sidebar: "Looking for wifi and a seat? Loc8r helps find places.",
            locations: responseBody
        });
    };


module.exports.homelist = function(req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {
            lng : -0.7992599,
            lat : 51.378091,
            maxDistance : 99999
        }
    };

    request(
        requestOptions,
        function (err, response, body) {
            var i, data;
            data = body;
            var code =response.statusCode;
            if (code === 200 && data.length) {
                for (i = 0; i < data.length; i++) {
                    data[i].distance = _formatDistance(data[i].distance);
                }
            }
            renderHomepage(req, res, data);
        }
    );
    };

var _formatDistance = function(distance){
    var numDistance, unit;
    if (distance > 1){
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
    } else {
        numDistance = parseInt(distance*1000, 10);
        unit = 'm';
    }
    return numDistance + unit;
};

module.exports.locationInfo = function(req, res) {
    res.render('location-info', {
        title: 'Starcups',
        pageHeader: {title: 'Starcups'},
        sidebar:{
            context: 'is on Loc8r because it has accessible wifi',
            callToAction: 'if you\'ve been and you like\'t - please'
            },
        location: {
            name: 'Starcups',
            address: '125 High Sreet, Reading, RG6 1 PS',
            rating: 3,
            facilities: ['Hot drinks','Food', 'Premium wifi'],
            coords: {lat: 51.455041, lng: -0.9690884},
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            },{
                days: 'Saturday',
                opening: '9:00am',
                closing: '5:00pm',
                closed: false
            },{
                days: 'Sanday',
                closed: true
            }],
            reviews: [{
                author: 'Simon Holmes',
                rating: 5,
                timestamp: '16 july 2013',
                reviewText: 'Wat a great place.'
            },{
                author: 'Charlie Chaplin',
                rating: 3,
                timestamp: '16 june 2013',
                reviewText: 'It was okay.'
            }]
        }
        });
};

module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader:{ title: 'review Starcups'}
    });
};