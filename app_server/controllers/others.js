// функция октрытия домашней страницы
// render - функция express компиляции шаблона страницы
// index - имя шаблона index.jade
module.exports.about = function(req, res) {
    res.render('index', {title: 'About'});
};