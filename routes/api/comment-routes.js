const router = require("express").Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/:pizzaId
router.route("/:pizzaId").post(addComment);

// /api/comments/:pizzaId/:commentId
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

// /api/comments/:pizzaId/:commentId/:replyId
//basically saying that if you have a commentId and a replyId, you can delete the reply
//follows best practices for deleting a resource in express by creating a restful route
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
