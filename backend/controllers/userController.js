const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Annonce = require('../models/Annonce');
const DemandeTransport = require('../models/DemandeTransport');

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
        if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === 'true';
        if (req.query.search) {
            filter.$or = [
                { nom: { $regex: req.query.search, $options: 'i' } },
                { prenom: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'utilisateur',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { nom, prenom, email, telephone, role } = req.body;

        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Cet email est déjà utilisé par un autre utilisateur'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                nom: nom || existingUser.nom,
                prenom: prenom || existingUser.prenom,
                email: email || existingUser.email,
                telephone: telephone || existingUser.telephone,
                role: role || existingUser.role
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            data: updatedUser
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'utilisateur',
            error: error.message
        });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        if (req.user.id === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas désactiver votre propre compte'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès`,
            data: {
                id: user._id,
                isActive: user.isActive
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification du statut',
            error: error.message
        });
    }
};

exports.toggleUserVerification = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.json({
            success: true,
            message: `Utilisateur ${user.isVerified ? 'vérifié' : 'non vérifié'} avec succès`,
            data: {
                id: user._id,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification du statut de vérification',
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        if (req.user.id === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas supprimer votre propre compte'
            });
        }

        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'utilisateur',
            error: error.message
        });
    }
};

exports.getTotalUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ totalUsers: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalAnnonces = async (req, res) => {
    try {
        const count = await Annonce.countDocuments();
        res.json({ totalAnnonces: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAcceptanceRate = async (req, res) => {
    try {
        const total = await DemandeTransport.countDocuments();
        const accepted = await DemandeTransport.countDocuments({ statut: 'acceptee' });
        const rate = total === 0 ? 0 : (accepted / total) * 100;
        res.json({ acceptanceRate: rate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDemandes = async (req, res) => {
    try {
        const count = await DemandeTransport.countDocuments();
        res.json({ totalDemandes: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveUsers = async (req, res) => {
    try {
        // Consider users active if they logged in within the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const count = await User.countDocuments({ lastLogin: { $gte: oneWeekAgo } });
        res.json({ activeUsers: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 