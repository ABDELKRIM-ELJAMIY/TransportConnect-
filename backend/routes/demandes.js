const express = require('express');
const router = express.Router();
const {
    createDemande,
    getMyDemandes,
    getDemandesByAnnonce,
    updateDemandeStatus,
    deleteDemande
} = require('../controllers/demandeController');

const { protect, authorizeRoles } = require('../middlewares/auth');
const { validateDemande } = require('../middlewares/validation');

router.use(protect);

router.post('/', authorizeRoles('expediteur'), validateDemande, createDemande);
router.get('/mine', authorizeRoles('expediteur'), getMyDemandes);
router.get('/annonce/:id', authorizeRoles('conducteur', 'admin'), getDemandesByAnnonce);
router.patch('/:id/status', authorizeRoles('conducteur', 'admin'), updateDemandeStatus);
router.delete('/:id', authorizeRoles('expediteur', 'admin'), deleteDemande);

module.exports = router; 