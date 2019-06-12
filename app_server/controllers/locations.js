module.exports.homelist = function(req, res) {
    res.render('location-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader:{
          title:'Loc8r',
          strapline: 'Find places to work with wifi!'
    },
        sidebar: "Looking for wifi and a seat? Loc8r helps find places.",
    locations:[{
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '100m'
    },{
        name: 'Cafe Hero',
        address: '125 High Street, Reading, RG6 2PS',
        rating: 4,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '200m'
    },{
        name: 'Burger Quenn',
        address: '125 High Street, Reading, RG6 3PS',
        rating: 2,
        facilities: ['Food', 'Premium wifi'],
        distance: '250m'

    }]
    });
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