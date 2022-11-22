const Post = require("../models/post");
const validationSession = require("../util/validation-session");
const validation = require("../util/validation");

function getHome(req, res) {
  res.render("welcome");
}

async function getAdmin(req, res) {
  // if (!res.locals.isAuth) {
  //   return res.status(401).render("401");
  // }
  // We need to add this 401 error to other routes as well.
  // Because people still can access the posts if they entered the 
  // url of the post correctly even they are not authenticated.
  // Same goes for create post and other routes as well.
  // We can create a custom middleware and add it to all these routes.
  // Now, now we can get rid of this if check because getAdmin is also protected through
  // guard route function on auth-protection-middleware.js which we imported to blog.js 

  const posts = await Post.fetchAll();

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: "",
    content: "",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect("/admin");
      }
    );

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
}

async function getSinglePost(req, res, next) {
  // For async functions, the default error handling middleware won't get executed.
  // So if we manually enter a id of a post that does not exist, the server crashes.
  // Therefor We need to manually handle the error first.
  let post;
  try {
    post = new Post(null, null, req.params.id);
  } catch (error) {
    next(error);
    // Now this will reach the default error handling middleware.
    // or instead of next(error) => we can render a 404 page like this.
    // return res.render("404");
    return;
  }
  // We should consider doing this to all the actions where we reach out to a database.

  await post.fetch();

  if (!post.title || !post.content) {
    return res.render("404");
  }

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: post.title,
    content: post.content,
  });

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return;
  }

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  const post = new Post(null, null, req.params.id);
  await post.delete();
  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
};
