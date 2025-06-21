const express = require('express');
const router = express.Router();
const {
    createAnnonce,
    getAllAnnonces,
    getAnnonceById,
    updateAnnonce,
    deleteAnnonce,
    getMyAnnonces,
    completeAnnonce
} = require('../controllers/annonceController');
const { getDemandesByAnnonce } = require('../controllers/demandeController');

const { protect, authorizeRoles } = require('../middlewares/auth');
const { validateAnnonce } = require('../middlewares/validation');

router.get('/', getAllAnnonces);

router.use(protect);

router.post('/', authorizeRoles('conducteur'), validateAnnonce, createAnnonce);
router.get('/mine', authorizeRoles('conducteur'), getMyAnnonces);

router.get('/:id', getAnnonceById);
router.get('/:id/demandes', authorizeRoles('conducteur', 'admin'), getDemandesByAnnonce);
router.put('/:id', updateAnnonce);
router.put('/:id/complete', authorizeRoles('conducteur', 'admin'), completeAnnonce);
router.delete('/:id', deleteAnnonce);

module.exports = router; 