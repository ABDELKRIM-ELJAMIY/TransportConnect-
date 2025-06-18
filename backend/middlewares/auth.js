const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès refusé - Token manquant'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide - Utilisateur non trouvé'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Compte désactivé'
            });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            nom: user.nom,
            prenom: user.prenom
        };

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Erreur d\'authentification'
            });
        }
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Accès interdit - Rôle ${req.user.role} non autorisé`
            });
        }
        next();
    };
};

exports.checkOwnership = (model, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[paramName];
            const resource = await model.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Ressource non trouvée'
                });
            }

            if (resource.userId && resource.userId.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Accès interdit - Vous n\'êtes pas propriétaire de cette ressource'
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la vérification des permissions'
            });
        }
    };
};