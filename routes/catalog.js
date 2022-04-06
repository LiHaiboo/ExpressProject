var express = require('express');
var router = express.Router();
let multer = require('multer');
var upload = multer({
    dest:'public/evidences'
})
var grade_upload = multer({
    dest:'public/grades'
})

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');
var student_course_controller = require('../controllers/student_courseController');
var academic_output_controller = require('../controllers/academic_output_controller');
var approveController = require('../controllers/approveController');
var competition_controller = require('../controllers/competitionController');
var class_controller = require('../controllers/classController');


/// BOOK ROUTES ///
router.get('/*',(req, res,next) => {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;

    if(!isLogined){
        return res.redirect('/login');
    }
    next();
});

// GET catalog home page.
router.get('/',book_controller.index);

/// GRADE ROUTES ///
router.get('/grades',student_course_controller.grade_list);

router.post('/grades',student_course_controller.grade_query_post);

router.get('/grades/:id',student_course_controller.grade_detail_get);

router.post('/grades/:id',student_course_controller.grade_detail_post);

router.get('/academic_outputs',academic_output_controller.academic_output_list);

router.get('/academic_outputs/create',academic_output_controller.output_create_get);

router.post('/academic_outputs/create',upload.single('file'),academic_output_controller.output_create_post);

router.get('/academic_outputs/:id',academic_output_controller.output_detail);

router.get('/competitions',competition_controller.competition_list);

router.get('/competitions/:id',competition_controller.competition_detail);

router.get('/classes',class_controller.class_detail);

/// tutor ///
router.get('/approve',approveController.approve_list);

router.get('/approve/output',approveController.output_approve_get);

router.get('/approve/output/:id',approveController.output_approve_detail_get);

router.post('/approve/output/:id',approveController.output_approve_detail_post);

/// admin ///
router.get('/grade_management/upload',student_course_controller.grade_upload_get);

router.post('/grade_management/upload',grade_upload.single('file'),student_course_controller.grade_upload_post);




// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;