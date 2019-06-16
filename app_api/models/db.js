var mongoose = require( 'mongoose');

var dbURI = process.env.MONGOLAB_URI;

console.log("подключился "+process.env.MONGOLAB_URI);
console.log("подключился "+process.env.NODE_ENV);


mongoose.connect(dbURI, { useNewUrlParser: true });

var readLine = require("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function () {
        process.emit ("SIGINT");

    });
}


mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connected error ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected ');
});
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected throgh ' +msg);
        callback();
    });
};
// для перезапуска nodemon
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// для завершения приложения
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
// для завершения приложения heroku
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./locations');
