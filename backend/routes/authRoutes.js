const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/register', [
    check('nom').notEmpty().withMessage("Nom requis"),
    check('prenom').notEmpty().withMessage("Prénom requis"),
    check('email').isEmail().withMessage("Email invalide"),
    check('password').isLength({ min: 6 }).withMessage("6 caractères minimum"),
], register);

router.post('/login', login);

module.exports = router;

