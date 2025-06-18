const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    toggleUserVerification,
    deleteUser
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

module.exports = router; 