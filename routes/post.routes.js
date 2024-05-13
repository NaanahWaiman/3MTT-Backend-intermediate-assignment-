//import Post controller
const postController = require("./../controllers/post.controller")

//import authetication middleware
const authController = require('./../auth/user.auth')

const express = require('express');
const router = express.Router();

//API endpoint structure
router.get('/', postController.getAllPublishedPost)
router.get("/:postId", postController.getASinglePublishedPost)

router.post("/", authController.authenticate, postController.uploadCoverPhoto, postController.createAPost) //protected route 
router.put("/:postId", authController.authenticate, postController.updateAPost) //protected route
router.delete("/:postId", authController.authenticate, postController.deleteAPost) //protected route

module.exports = router;