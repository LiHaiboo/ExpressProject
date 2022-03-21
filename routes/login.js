var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/', user_controller.login_get);

// POST request for creating Book.
router.post('/', user_controller.login_post);

module.exports = router;
