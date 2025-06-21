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
    getActiveUsers,
    updateProfile,
    getConducteurData,
    updateConducteurData,
    getExpediteurData,
    updateExpediteurData,
    changePassword,
    requestVerification,
    checkVerificationStatus,
    uploadProfileImage
} = require('../controllers/userController');

const { protect, authorizeRoles } = require('../middlewares/auth');
const { validateUserUpdate, validateProfileUpdate } = require('../middlewares/validation');
const upload = require('../middlewares/upload');

// User profile routes (require authentication but not admin)
// Place specific routes before parameterized routes
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/conducteur', protect, updateConducteurData);
router.put('/expediteur', protect, updateExpediteurData);
router.put('/change-password', protect, changePassword);
router.post('/request-verification', protect, requestVerification);
router.get('/verification-status', protect, checkVerificationStatus);
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Specific expediteur route (must come before admin routes)
router.get('/:userId/expediteur', protect, (req, res, next) => {
    console.log('Expediteur route hit - userId:', req.params.userId);
    console.log('Expediteur route hit - req.user:', req.user);
    next();
}, getExpediteurData);

// Parameterized routes (must come after specific routes)
router.get('/:userId/conducteur', protect, getConducteurData);

// Admin routes (require admin role)
router.use(protect);
router.use(authorizeRoles('admin'));

// Admin-specific routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUserUpdate, updateUser);
router.patch('/:id/status', toggleUserStatus);
router.patch('/:id/verify', toggleUserVerification);
router.delete('/:id', deleteUser);

// Admin statistics routes
router.get('/admin/stats/users', getTotalUsers);
router.get('/admin/stats/annonces', getTotalAnnonces);
router.get('/admin/stats/acceptance-rate', getAcceptanceRate);
router.get('/admin/stats/demandes', getTotalDemandes);
router.get('/admin/stats/active-users', getActiveUsers);

module.exports = router; 