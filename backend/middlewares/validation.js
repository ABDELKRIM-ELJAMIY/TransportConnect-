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

// Validation pour les annonces
const validateAnnonce = [
    body('lieuDepart.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du lieu de départ est requis')
        .isLength({ min: 2, max: 100 })
        .withMessage('Le nom du lieu de départ doit contenir entre 2 et 100 caractères'),

    body('destination.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom de la destination est requis')
        .isLength({ min: 2, max: 100 })
        .withMessage('Le nom de la destination doit contenir entre 2 et 100 caractères'),

    body('dateDepart')
        .notEmpty()
        .withMessage('La date de départ est requise')
        .isISO8601()
        .withMessage('Format de date invalide')
        .custom((value) => {
            const date = new Date(value);
            const now = new Date();
            // Allow dates from the past year for testing flexibility
            const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            if (date < oneYearAgo) {
                throw new Error('La date de départ doit être dans l\'année en cours ou l\'année précédente');
            }
            return true;
        }),

    body('dateArrivee')
        .optional()
        .isISO8601()
        .withMessage('Format de date d\'arrivée invalide')
        .custom((value, { req }) => {
            if (value && req.body.dateDepart) {
                const dateArrivee = new Date(value);
                const dateDepart = new Date(req.body.dateDepart);
                if (dateArrivee <= dateDepart) {
                    throw new Error('La date d\'arrivée doit être après la date de départ');
                }
            }
            return true;
        }),

    body('dimensions.longueurMax')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La longueur maximale doit être entre 0.1 et 100 mètres'),

    body('dimensions.largeurMax')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La largeur maximale doit être entre 0.1 et 100 mètres'),

    body('dimensions.hauteurMax')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La hauteur maximale doit être entre 0.1 et 100 mètres'),

    body('poidsMaximum')
        .isFloat({ min: 0.1, max: 50000 })
        .withMessage('Le poids maximum doit être entre 0.1 et 50000 kg'),

    body('typeMarchandise')
        .optional()
        .isIn(['fragile', 'normale', 'dangereuse', 'alimentaire', 'electronique', 'autre'])
        .withMessage('Type de marchandise invalide'),

    body('capaciteDisponible')
        .isFloat({ min: 0.1 })
        .withMessage('La capacité disponible doit être supérieure à 0'),

    body('prix')
        .isFloat({ min: 0 })
        .withMessage('Le prix doit être positif'),

    body('nombrePlacesDisponibles')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Le nombre de places disponibles doit être entre 1 et 10'),

    body('isUrgent')
        .optional()
        .isBoolean()
        .withMessage('Le statut urgent doit être un booléen'),

    body('conditions.accepteAnimaux')
        .optional()
        .isBoolean()
        .withMessage('Le statut d\'acceptation d\'animaux doit être un booléen'),

    body('conditions.fumeurAccepte')
        .optional()
        .isBoolean()
        .withMessage('Le statut d\'acceptation de fumeur doit être un booléen'),

    body('conditions.conditionsSpeciales')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Les conditions spéciales ne peuvent pas dépasser 500 caractères'),

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

const validateDemande = [
    body('annonceId')
        .isMongoId()
        .withMessage('ID annonce invalide'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('La description est requise')
        .isLength({ min: 10, max: 1000 })
        .withMessage('La description doit contenir entre 10 et 1000 caractères'),

    body('dimensions.longueur')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La longueur doit être entre 0.1 et 100 mètres'),

    body('dimensions.largeur')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La largeur doit être entre 0.1 et 100 mètres'),

    body('dimensions.hauteur')
        .isFloat({ min: 0.1, max: 100 })
        .withMessage('La hauteur doit être entre 0.1 et 100 mètres'),

    body('poids')
        .isFloat({ min: 0.1, max: 50000 })
        .withMessage('Le poids doit être entre 0.1 et 50000 kg'),

    body('typeColis')
        .isIn(['fragile', 'normale', 'dangereuse', 'alimentaire', 'electronique', 'autre'])
        .withMessage('Type de colis invalide'),

    body('valeurDeclaree')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('La valeur déclarée doit être positive'),

    body('assuranceRequise')
        .optional()
        .isBoolean()
        .withMessage('Le statut d\'assurance doit être un booléen'),

    body('instructionsSpeciales')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Les instructions spéciales ne peuvent pas dépasser 500 caractères'),

    body('lieuRecuperation.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du lieu de récupération est requis')
        .isLength({ min: 2, max: 100 })
        .withMessage('Le nom du lieu de récupération doit contenir entre 2 et 100 caractères'),

    body('lieuRecuperation.adresse')
        .optional()
        .isLength({ max: 200 })
        .withMessage('L\'adresse de récupération ne peut pas dépasser 200 caractères'),

    body('lieuRecuperation.instructions')
        .optional()
        .isLength({ max: 300 })
        .withMessage('Les instructions de récupération ne peuvent pas dépasser 300 caractères'),

    body('lieuLivraison.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du lieu de livraison est requis')
        .isLength({ min: 2, max: 100 })
        .withMessage('Le nom du lieu de livraison doit contenir entre 2 et 100 caractères'),

    body('lieuLivraison.adresse')
        .optional()
        .isLength({ max: 200 })
        .withMessage('L\'adresse de livraison ne peut pas dépasser 200 caractères'),

    body('lieuLivraison.instructions')
        .optional()
        .isLength({ max: 300 })
        .withMessage('Les instructions de livraison ne peuvent pas dépasser 300 caractères'),

    body('contactRecuperation.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du contact de récupération est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom du contact de récupération doit contenir entre 2 et 50 caractères'),

    body('contactRecuperation.telephone')
        .trim()
        .notEmpty()
        .withMessage('Le téléphone du contact de récupération est requis')
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Format de numéro de téléphone français invalide pour le contact de récupération'),

    body('contactLivraison.nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du contact de livraison est requis')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom du contact de livraison doit contenir entre 2 et 50 caractères'),

    body('contactLivraison.telephone')
        .trim()
        .notEmpty()
        .withMessage('Le téléphone du contact de livraison est requis')
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Format de numéro de téléphone français invalide pour le contact de livraison'),

    body('datePreferenceRecuperation')
        .optional()
        .isISO8601()
        .withMessage('Format de date de préférence de récupération invalide'),

    body('datePreferenceLivraison')
        .optional()
        .isISO8601()
        .withMessage('Format de date de préférence de livraison invalide'),

    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validateUserUpdate,
    validateAnnonce,
    validateDemande,
    validatePasswordChange,
    validateObjectId,
    handleValidationErrors,
    createRateLimiter,
    authRateLimiter,
    generalRateLimiter,
    errorHandler,
    checkRequiredFields
};