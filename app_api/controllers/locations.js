var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (function () {
    var earthRadius = 6371;
    // радиус земли в километрах
    var getDistanceFromRads = function (rads) {
        return parseFloat(rads*earthRadius);
    };
    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);

    };

    return {
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };

})();


var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = function(req, res) {
    console.log('locationsListByDistance:');
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = 99999;
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    console.log('point: ' + point)
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: 10
    };
    console.log('geoOptions: ' + geoOptions);
    if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
        console.log('locationsListByDistance missing params');
        sendJsonResponse(res, 404, {
            "message": "lng, lat and maxDistance query parameters are all required"
        });
        return;
    } else {
        console.log('locationsListByDistance running...');
        Loc.aggregate(
            [{
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'dist.calculated',
                    'maxDistance': maxDistance
                }
            }],
            function(err, results) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    locations = buildLocationList(req, res, results);
                    sendJsonResponse(res, 200, locations);
                }
            }
        )
    };
};
var buildLocationList = function(req, res, results) {
    console.log('buildLocationList:');
    var locations = [];
    results.forEach(function(doc) {
        locations.push({
            distance: doc.dist.calculated,
            name: doc.name,
            address: doc.address,
            rating: doc.rating,
            facilities: doc.facilities,
            _id: doc._id
        });
    });
    return locations;
};


module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, function (err, location) {
        if (err){
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, location);
        }
        });
   };

module.exports.locationsReadOne = function (req, res) {
// проверка, есть-ли в параметрах запроса locationid
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
// проверка, возвращает-ли Mongoose месторасположение
                if (!location) {
                    sendJsonResponse(res, 404, {"message": "locationid not found"});
                    return;
// проверка, если Mongoose вернул ошибку
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });

    } else {
        sendJsonResponse(res, 404, {"message":"No lacation in request"});
    }
        };


module.exports.locationsUpdateOne = function (req, res) {
  if (!req.params.locationid){
      sendJsonResponse(res, 404, {"message":"Not found locationid tut"});
      return;
  }
  Loc
      .findById(req.params.locationid)
      .select('-reviews -rating')
      .exec(
          function (err, location) {
              if (!location){
                  sendJsonResponse(res, 404, {"message":"locationid not found"});
                  return;
              } else if (err) {
                  sendJsonResponse(res, 400, err);
                  return;
              }
              location.name= req.body.name;
              location.address= req.body.address;
              location.facilities= req.body.facilities.split(",");
              location.coords= [parseFloat(req.body.lng), parseFloat(req.body.lat)];
              location.openingTimes= [{
                  days: req.body.days1,
                  opening: req.body.opening1,
                  closing: req.body.closing1,
                  closed: req.body.closed1,
              }, {
                  days: req.body.days2,
                  opening: req.body.opening2,
                  closing: req.body.closing2,
                  closed: req.body.closed2,
              }];
              location.save(function (err, location) {
                  if (err){
                      sendJsonResponse(res, 404, err);
                  } else {
                      sendJsonResponse(res, 200, location);
                  }
                  });
              }
      );
};

module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;
    if (locationid){
        Loc
            .findByIdAndRemove(locationid)
            .exec(
                function (err, location) {
                    if (err){
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {"message":"No locationid"});
    }
};