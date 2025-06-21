const express = require('express');
const router = express.Router();
const { getHistorique } = require('../controllers/historiqueController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getHistorique);

module.exports = router; 