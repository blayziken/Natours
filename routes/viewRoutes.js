const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);

router.get('/tour/:slug', authController.protect, authController.isLoggedIn, viewsController.getTour);

// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-tour', authController.protect, viewsController.getMyTours);


// router.post(
//     '/submit-user-data',
//     authController.protect,
//     viewsController.updateUserData
// );

module.exports = router;
