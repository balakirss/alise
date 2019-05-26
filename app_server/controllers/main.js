// функция октрытия домашней страницы
// render - функция express компиляции шаблона страницы
// index - имя шаблона index.jade
module.exports.index = function(req, res) {
    res.render('index', {title: 'Express Балакир Сергей'});
};