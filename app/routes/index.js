/**********
* index.js file (for routes)
**********/
const apiRoute = require('./apis'); //apis/index.js   //v1controller is returned

const init = (server) => {
    server.use('/api', apiRoute);
}
module.exports = {
    init: init
};
