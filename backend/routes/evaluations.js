const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluationsByUser } = require('../controllers/evaluationController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createEvaluation);
router.get('/user/:userId', getEvaluationsByUser);

module.exports = router; 