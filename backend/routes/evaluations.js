const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluationsByUser, replyToEvaluation } = require('../controllers/evaluationController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createEvaluation);
router.get('/user/:userId', getEvaluationsByUser);
router.patch('/:evaluationId/reply', protect, replyToEvaluation);

module.exports = router; 