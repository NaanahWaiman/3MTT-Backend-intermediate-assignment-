//post controller
const userController = require("./../controllers/user.controller")

//authetication middleware
const authController = require('./../auth/user.auth')

const express = require('express');
const router = express.Router();

//author api endpoints
router.get('/author', authController.authenticate, userController.getAllPosts)

router.post("/auth/signup", authController.signup)

router.post("/auth/login", authController.login)


module.exports = router;