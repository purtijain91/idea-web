const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { createIdea, getIdeas, toggleLike, addComment, updateIdea, deleteIdea } = require('../controllers/ideaController');
const upload = require('../middleware/uploadMiddleware');

//create idea route
router.post('/create', protect, upload.array("files", 5),createIdea);
router.get('/',getIdeas);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.put("/:id", protect, updateIdea);
router.delete("/:id", protect, deleteIdea);

module.exports = router