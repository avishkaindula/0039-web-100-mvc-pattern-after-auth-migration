const express = require("express");

const blogController = require("../controllers/post-controller");

const guardRoute = require("../middlewares/auth-protection-middleware");
// We should use guardRoute middleware in here instead of app.js

const router = express.Router();

router.get("/", blogController.getHome);

// router.get("/admin", guardRoute, blogController.getAdmin);
// We can add multiple middleware functions like this.
// They get executed step by step from left to right.
// We don't execute is like this guardRoute()
// Instead, it get executed by express.
// But instead of adding guard route like this one by one, we can add
// guardRoute to all routes in one go like below.
router.use(guardRoute);
// Now, all the routes "below" will get protected by guard route.
// the "/" route above won't be protected by guardRoute because it sits above router.use(guardRoute);
// But we actually don't want to protect it through guardRoute because it should not be protected and
// and it should be accessible from everyone.

router.get("/admin", blogController.getAdmin);

router.post("/posts", blogController.createPost);

router.get("/posts/:id/edit", blogController.getSinglePost);

router.post("/posts/:id/edit", blogController.updatePost);

router.post("/posts/:id/delete", blogController.deletePost);

module.exports = router;
