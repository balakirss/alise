var mongoose = require('mongoose');
var Loc = mongoose.model('Location');


var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var updateAverageRating = function (locationid) {
    Loc
        .findById(locationid)
        .select('rating reviews')
        .exec(
            function (err, location) {
                if (!err){
                    doSetAverageRating(location);
                }
                });
    };

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0){
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i=0; i < reviewCount; i++){
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function (err) {
            if (err){
                console.log(err);
            } else {
                console.log("Average rating update");
            }
        });
    }
};

var doAddReview = function(req, res, location){
    if (!location) {
        sendJsonResponse(res, 404, {"message": "locationid not found"});
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location) {
            var thisReview;
            if (err){
                console.log(err);
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview=location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
            });
    }
};
module.exports.reviewsCreate = function (req, res) {
    var locationid = req.params.locationid;
    if (locationid){
        Loc
            .findById(locationid)
            .select('reviews')
            .exec(
                function (err, location) {
                    if (err){
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddReview(req, res, location);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {"message": "Not found locationid"});
    }
    };


//  ПОКАЗАТЬ ЗАПИСЬ ИЗ ОТЗЫВОВ
module.exports.reviewsReadOne = function (req, res) {
// проверка, есть-ли в параметрах запроса locationid и reviewid
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            // мы хотим получить только название месторасположения
            .select('name reviews')
            .exec(
                function (err, location) {
                var response, review;
// проверка, возвращает-ли Mongoose месторасположение
                if (!location) {
                    sendJsonResponse(res, 404, {"message": "locationid not found"});
                    return;
// проверка, если Mongoose вернул ошибку
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
// проверка что у возвращенного месторасположения есть отзывы
     if (location.reviews && location.reviews.length >0) {
// если отзыв найден - возвращаем ответ
         review = location.reviews.id(req.params.reviewid);
         if (!review) {
             sendJsonResponse(res, 404, {"message": "reviewid not found"});
         } else {
// создаем объек ответа - отзыв, название места и id
             response = {
                 location: {
                     name: location.name,
                     id: req.params.locationid
                 },
                 review: review
             };
             sendJsonResponse(res, 200, response);
         }
     } else {
         sendJsonResponse(res, 404, {"message" : "No reviews found"});
                 }
             }
            );
     } else {
                sendJsonResponse(res, 404,{"message":"Not found, location and reviewid are both required"});
}
};


module.exports.reviewsUpdateOne = function (req, res) {
 if (!req.params.locationid || !req.params.reviewid){
     sendJsonResponse(res, 404, {"message":"not found locationid or reviewid"});
     return;
 }
 Loc
     .findById(req.params.locationid)
     .select('reviews')
     .exec(
         function (err, location) {
             var thisReview;
             if (!location){
                 sendJsonResponse(res, 404, {"message":"locationid not found"});
             return;
             } else if (err){
                 sendJsonResponse(res, 400, err);
                 return;
             }
             if (location.reviews && location.reviews.length > 0){
                 console.log('req.params.reviewid:' + req.params.reviewid);
                 console.log('req.params.locationid:' + req.params.locationid);
                 console.log('location.reviews.id(req.params.reviewid):' + location.reviews.id(req.params.reviewid));

                 thisReview = location.reviews.id(req.params.reviewid);
                 if (!thisReview){
                     sendJsonResponse(res, 404, {"message":"reviewid not found tut"});

                 } else {
                     thisReview.author = req.body.author;
                     thisReview.rating = req.body.rating;
                     thisReview.reviewText = req.body.reviewText;
                     location.save(function (err, location) {
                         if (err) {
                             sendJsonResponse(res, 404, err);

                         } else {
                             updateAverageRating(location._id);
                             sendJsonResponse(res, 200, thisReview);
                         }
                         });
                 }
             } else {
                 sendJsonResponse(res, 404, {"message":"No review to update"});
             }
         }
     );
};

module.exports.reviewsDeleteOne = function (req, res) {
  if (!req.params.locationid || !req.params.reviewid){
      sendJsonResponse(res, 404, {"message":"not found locationid or reviewid"});
      return;
  }
  Loc
      .findById(req.params.locationid)
      .select('reviews')
      .exec(
          function (err, location) {
              if (!location){
                  sendJsonResponse(res, 404, {"message":"locationid not found"});
                  return;
              } else if (err){
                  sendJsonResponse(res, 400, err);
                  return;
              }
              if (location.reviews && location.reviews.length > 0){
                  if (!location.reviews.id(req.params.reviewid)) {
                      sendJsonResponse(res, 404, {"message":"reviewid not found"});

                  } else {
                      location.reviews.id(req.params.reviewid).remove();
                      location.save (function (err) {
                          if (err){
                              sendJsonResponse(res, 404, err);
                          } else {
                              updateAverageRating(location._id);
                              sendJsonResponse(res, 204, null);
                          }
                          });
                  }
              } else {
                  sendJsonResponse(res, 404, {"message":"no review to delete"});
              }
          }
      );
};
