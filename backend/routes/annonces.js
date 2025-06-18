const express = require('express');
const router = express.Router();
const {
    createAnnonce,
    getAllAnnonces,
    getAnnonceById,
    updateAnnonce,
    deleteAnnonce,
    getMyAnnonces
} = require('../controllers/annonceController');

const { protect, authorizeRoles } = require('../middlewares/auth');
const { validateAnnonce } = require('../middlewares/validation');

// Public routes (no authentication required)
router.get('/', getAllAnnonces);

// Protected routes
router.use(protect);

// Routes for conducteurs - PUT /mine BEFORE /:id to avoid conflicts
router.post('/', authorizeRoles('conducteur'), validateAnnonce, createAnnonce);
router.get('/mine', authorizeRoles('conducteur'), getMyAnnonces);

// Routes for specific announcements (must come after /mine)
router.get('/:id', getAnnonceById);
router.put('/:id', updateAnnonce);
router.delete('/:id', deleteAnnonce);

module.exports = router; 