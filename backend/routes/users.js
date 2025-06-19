const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    toggleUserVerification,
    deleteUser,
    getTotalUsers,
    getTotalAnnonces,
    getAcceptanceRate,
    getTotalDemandes,
    getActiveUsers
} = require('../controllers/userController');

const { protect, authorizeRoles } = require('../middlewares/auth');
const { validateUserUpdate } = require('../middlewares/validation');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.put('/:id', validateUserUpdate, updateUser);

router.patch('/:id/status', toggleUserStatus);

router.patch('/:id/verify', toggleUserVerification);

router.delete('/:id', deleteUser);

router.get('/admin/stats/users', getTotalUsers);
router.get('/admin/stats/annonces', getTotalAnnonces);
router.get('/admin/stats/acceptance-rate', getAcceptanceRate);
router.get('/admin/stats/demandes', getTotalDemandes);
router.get('/admin/stats/active-users', getActiveUsers);

module.exports = router; 