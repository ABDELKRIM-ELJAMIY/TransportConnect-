const { body, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));

        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errorMessages
        });
    }

    next();
};

// Validation pour l'inscription
const validateRegister = [
    body('nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('prenom')
        .trim()
        .notEmpty()
        .withMessage('Le prénom est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('L\'email ne peut pas dépasser 100 caractères'),

    body('telephone')
        .trim()
        .notEmpty()
        .withMessage('Le numéro de téléphone est requis')
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Format de numéro de téléphone français invalide'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        }),

    body('role')
        .optional()
        .isIn(['conducteur', 'expediteur'])
        .withMessage('Le rôle doit être "conducteur" ou "expediteur"'),

    handleValidationErrors
];

// Validation pour la connexion
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
        .isLength({ min: 1 })
        .withMessage('Le mot de passe ne peut pas être vide'),

    handleValidationErrors
];

// Validation pour la mise à jour du profil
const validateProfileUpdate = [
    body('nom')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('prenom')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('telephone')
        .optional()
        .trim()
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Format de numéro de téléphone français invalide'),

    body('currentPassword')
        .if(body('newPassword').exists())
        .notEmpty()
        .withMessage('Le mot de passe actuel est requis pour changer le mot de passe'),

    body('newPassword')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),

    handleValidationErrors
];

// Validation pour la mise à jour d'utilisateur (admin)
const validateUserUpdate = [
    body('nom')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('prenom')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('L\'email ne peut pas dépasser 100 caractères'),

    body('telephone')
        .optional()
        .trim()
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Format de numéro de téléphone français invalide'),

    body('role')
        .optional()
        .isIn(['conducteur', 'expediteur', 'admin'])
        .withMessage('Le rôle doit être "conducteur", "expediteur" ou "admin"'),

    handleValidationErrors
];

// Validation pour le changement de mot de passe
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Le mot de passe actuel est requis'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),

    body('confirmNewPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Les nouveaux mots de passe ne correspondent pas');
            }
            return true;
        }),

    handleValidationErrors
];

// Validation générique pour les IDs MongoDB
const validateObjectId = (paramName) => {
    return [
        body(paramName)
            .isMongoId()
            .withMessage(`${paramName} doit être un ID MongoDB valide`),
        handleValidationErrors
    ];
};

// Middleware de rate limiting simple (en mémoire)
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Trop de requêtes, veuillez réessayer plus tard') => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Rate limiters spécifiques
const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes');
const generalRateLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Trop de requêtes, veuillez réessayer plus tard');

// Middleware de gestion d'erreurs global
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Format d\'ID invalide'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} déjà utilisé`
        });
    }

    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne'
    });
};

// Middleware pour vérifier si les champs requis sont présents
const checkRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = fields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Champs requis manquants',
                missingFields
            });
        }

        next();
    };
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validateUserUpdate,
    validatePasswordChange,
    validateObjectId,
    handleValidationErrors,
    createRateLimiter,
    authRateLimiter,
    generalRateLimiter,
    errorHandler,
    checkRequiredFields
};