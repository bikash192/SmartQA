const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.get('/:code', roomController.getByRoomID);
router.post('/:code/question', roomController.createQuestion);
router.get('/:code/question', roomController.getQuestions);
router.delete('/:code', roomController.deleteRoom);
router.delete('/:code/question/:id', roomController.deleteQuestion);
router.get('/:code/summary', roomController.summarizeQuestions);

module.exports = router;