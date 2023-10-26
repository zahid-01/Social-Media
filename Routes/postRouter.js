const { protect } = require("../Controllers/authController");
const {
  createPost,
  updatePost,
  getMyPosts,
  deletePost,
  likeUnlikePost,
  addComment,
} = require("../Controllers/postController");

const PostRouter = require("express").Router();

PostRouter.use(protect);
PostRouter.route("/").post(createPost).get(getMyPosts);
PostRouter.route("/:id")
  .patch(updatePost)
  .delete(deletePost)
  .put(likeUnlikePost)
  .post(addComment);

module.exports = PostRouter;
