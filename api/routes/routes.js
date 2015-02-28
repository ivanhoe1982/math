/**
 * Created by ivanhoe on 2/28/15.
 */

module.exports = function(app) {
    // server routes ===========================================================
    app.use('/user',require('./users.js'));
    // frontend routes =========================================================

    //// route to handle all angular requests
    //app.get('*', function(req, res) {
    //    res.sendFile('index.html', { root: __dirname+'../../../dist/' });
    //});
};

console.log('routes loaded');