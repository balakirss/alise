var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"};
//if (process.env.NODE_ENV === 'production'){
//    apiOptions.server = "https://balakirss.ru:3000";
//}

var renderHomepage = function(req,res, responseBody){
    var message;
    if (!(responseBody instanceof Array)){
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length){
            message = "No places found nearby";
        }
    }
    res.render('location-list',{
            title: 'Loc8r - find a place to work with wifi',
            pageHeader:{
                title:'Loc8r',
                strapline: 'Find places to work with wifi!'
            },
            sidebar: "Looking for wifi and a seat? Loc8r helps find places.",
            locations: responseBody,
            message: message
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
        //        lng : 1,
        //        lat : 1,
        //        maxDistance : 1


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

var renderDetailPage = function(req, res, locDetail){
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {title: locDetail.name},
        sidebar:{
            context: 'is on Loc8r because it has accessible wifi',
            callToAction: 'if you\'ve been and you like\'t - please'
        },
        location: locDetail
    });
};



var getLocationInfo = function (req, res, callback){
    var requestOptions, path;
        path = "/api/locations/" + req.params.locationid;
        requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {}
        };
        request(
            requestOptions,
            function (err, response, body) {
                var data = body;
                if (response.statusCode === 200) {
                    data.coords = {
                        lng: body.coords[0],
                        lat: body.coords[1]
                    };
                    callback(req, res, data);
                } else {
                   _showError(req, res, response.statusCode);
                }
            }
        );
    };



module.exports.locationInfo = function(req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

var _showError = function(req, res, status){
    var title, content;
    if (status === 404){
        title = "404, страница не найдена";
        content = "Ох, что-то пошло не так как задумывалось((";
    } else {
        title = status + ", что-то пошло не так";
        content = "что-то сломалось";
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });

};

var renderReviewForm = function(req, res, locDetail){
    res.render('location-review-form',{
        title: 'Review' + locDetail.name + 'on Loc8r',
        pageHeader: {title:'Review:' + locDetail.name},
        error: req.query.err
    });

};
module.exports.doAddReview = function(req,res){
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + '/reviews';
  postdata = {
      author: req.body.name,
      rating: parseInt(req.body.rating, 10),
      reviewText: req.body.review
  };
  requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText){
      res.redirect('/location/' + locationid + '/reviews/new?err=val');
  } else {
      request(
          requestOptions,
          function (err, response, body) {
              if (response.statusCode === 201) {
                  res.redirect('/location/' + locationid);
              } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
                  console.log("мы тута - ", response.statusCode);
                  res.redirect('/location/' + locationid + '/reviews/new?err=val');
              } else {
                  console.log(body);
                  _showError(req, res, response.statusCode);
              }

          }
      );
  }
};

module.exports.addReview = function(req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
    };