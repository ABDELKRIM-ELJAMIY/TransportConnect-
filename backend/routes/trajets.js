const express = require('express');
const router = express.Router();
const { commencerTrajet, terminerTrajet, annulerTrajet, suivreTrajet, getTrajetByAnnonceId } = require('../controllers/trajetController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/:id/commencer', commencerTrajet);
router.post('/:id/terminer', terminerTrajet);
router.post('/:id/annuler', annulerTrajet);
router.get('/:id/suivre', suivreTrajet);
router.get('/annonce/:annonceId', getTrajetByAnnonceId);

module.exports = router; 