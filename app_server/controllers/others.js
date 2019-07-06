module.exports.about = function(req, res) {
    res.render('generic-text', {
        title: 'About Loc8r',
        content: 'Loc8r created to help people.\n\nLorem dolor sit'
    });
};

module.exports.angularApp = function (req, res) {
    res.render('layout',{title:'Loc8r'});
};