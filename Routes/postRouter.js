const { protect } = require("../Controllers/authController");
const {
  createPost,
  updatePost,
  getMyPosts,
  deletePost,
  likeUnlikePost,
} = require("../Controllers/postController");

const PostRouter = require("express").Router();

PostRouter.use(protect);
PostRouter.route("/").post(createPost).get(getMyPosts);
PostRouter.route("/:id")
  .patch(updatePost)
  .delete(deletePost)
  .put(likeUnlikePost);

module.exports = PostRouter;
