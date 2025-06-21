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

// Update user's own profile
exports.updateProfile = async (req, res) => {
    try {
        const { nom, prenom, email, telephone } = req.body;

        const existingUser = await User.findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Cet email est déjà utilisé par un autre utilisateur'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                nom: nom || existingUser.nom,
                prenom: prenom || existingUser.prenom,
                email: email || existingUser.email,
                telephone: telephone || existingUser.telephone
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};

// Get conducteur data for a user
exports.getConducteurData = async (req, res) => {
    try {
        const Conducteur = require('../models/Conducteur');

        const conducteur = await Conducteur.findOne({ userId: req.params.userId })
            .populate('userId', 'nom prenom email telephone role');

        if (!conducteur) {
            return res.status(404).json({
                success: false,
                message: 'Données conducteur non trouvées'
            });
        }

        res.json({
            success: true,
            data: conducteur
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
            message: 'Erreur lors de la récupération des données conducteur',
            error: error.message
        });
    }
};

// Update conducteur data
exports.updateConducteurData = async (req, res) => {
    try {
        const Conducteur = require('../models/Conducteur');
        const { permisConduire, vehicule } = req.body;

        let conducteur = await Conducteur.findOne({ userId: req.user.id });

        if (!conducteur) {
            // Create new conducteur record if it doesn't exist
            conducteur = new Conducteur({
                userId: req.user.id,
                permisConduire: permisConduire || 'En attente',
                vehicule: {
                    marque: vehicule?.marque || '',
                    modele: vehicule?.modele || '',
                    annee: vehicule?.annee ? parseInt(vehicule.annee) : undefined,
                    couleur: vehicule?.couleur || '',
                    immatriculation: vehicule?.immatriculation || '',
                    capaciteMax: vehicule?.capaciteMax ? parseFloat(vehicule.capaciteMax) : undefined,
                    volumeMax: vehicule?.volumeMax ? parseFloat(vehicule.volumeMax) : undefined
                }
            });
        } else {
            // Update existing conducteur record
            if (permisConduire !== undefined && permisConduire.trim() !== '') {
                conducteur.permisConduire = permisConduire;
            }
            if (vehicule) {
                const updatedVehicule = { ...conducteur.vehicule };

                if (vehicule.marque) updatedVehicule.marque = vehicule.marque;
                if (vehicule.modele) updatedVehicule.modele = vehicule.modele;
                if (vehicule.annee) updatedVehicule.annee = parseInt(vehicule.annee);
                if (vehicule.couleur) updatedVehicule.couleur = vehicule.couleur;
                if (vehicule.immatriculation) updatedVehicule.immatriculation = vehicule.immatriculation;
                if (vehicule.capaciteMax) updatedVehicule.capaciteMax = parseFloat(vehicule.capaciteMax);
                if (vehicule.volumeMax) updatedVehicule.volumeMax = parseFloat(vehicule.volumeMax);

                conducteur.vehicule = updatedVehicule;
            }
        }

        await conducteur.save();

        res.json({
            success: true,
            message: 'Données conducteur mises à jour avec succès',
            data: conducteur
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des données conducteur',
            error: error.message
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe',
            error: error.message
        });
    }
};

// Request verification for conducteur
exports.requestVerification = async (req, res) => {
    try {
        console.log('requestVerification called for user:', req.user.id);

        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        console.log('User found:', { id: user._id, role: user.role, isVerified: user.isVerified });

        // Check if user is a conducteur
        if (user.role !== 'conducteur') {
            console.log('User is not a conducteur, role:', user.role);
            return res.status(400).json({
                success: false,
                message: 'Seuls les conducteurs peuvent demander une vérification'
            });
        }

        // Check if already verified
        if (user.isVerified) {
            console.log('User is already verified');
            return res.status(400).json({
                success: false,
                message: 'Votre compte est déjà vérifié'
            });
        }

        // Check if conducteur data is complete
        const Conducteur = require('../models/Conducteur');
        const conducteur = await Conducteur.findOne({ userId: req.user.id });

        console.log('Conducteur data:', conducteur);

        if (!conducteur) {
            console.log('No conducteur data found');
            return res.status(400).json({
                success: false,
                message: 'Veuillez compléter vos informations conducteur avant de demander la vérification'
            });
        }

        // Check required fields
        const missingFields = [];
        if (!user.nom || !user.prenom) missingFields.push('Informations personnelles');
        if (!conducteur.permisConduire) missingFields.push('Permis de conduire');
        if (!conducteur.vehicule?.marque || !conducteur.vehicule?.modele) missingFields.push('Informations véhicule');

        console.log('Missing fields:', missingFields);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Veuillez compléter les informations suivantes : ${missingFields.join(', ')}`
            });
        }

        // Create or update verification request
        const Notification = require('../models/Notification');

        // Check if verification request already exists
        const existingRequest = await Notification.findOne({
            userId: req.user.id,
            type: 'system',
            titre: 'Demande de Vérification Conducteur'
        });

        console.log('Existing request:', existingRequest);

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Une demande de vérification est déjà en cours d\'examen'
            });
        }

        // Create verification request notification
        const verificationRequest = new Notification({
            userId: req.user.id,
            type: 'system',
            titre: 'Demande de Vérification Conducteur',
            message: `Le conducteur ${user.prenom} ${user.nom} demande la vérification de son compte.`,
            donneesSupplement: {
                actionBouton: 'Voir le profil'
            },
            priorite: 'haute'
        });

        await verificationRequest.save();
        console.log('Verification request saved successfully');

        res.json({
            success: true,
            message: 'Demande de vérification envoyée avec succès. Un administrateur examinera votre profil.'
        });
    } catch (error) {
        console.error('Error in requestVerification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de la demande de vérification',
            error: error.message
        });
    }
};

// Check verification request status
exports.checkVerificationStatus = async (req, res) => {
    try {
        const Notification = require('../models/Notification');

        const existingRequest = await Notification.findOne({
            userId: req.user.id,
            type: 'system',
            titre: 'Demande de Vérification Conducteur'
        });

        res.json({
            success: true,
            hasRequest: !!existingRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du statut',
            error: error.message
        });
    }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        console.log('Upload request received:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune image n\'a été fournie'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Update user with profile image URL - use relative path to avoid CORS issues
        const imageUrl = `/uploads/profile-images/${req.file.filename}`;
        console.log('Generated image URL:', imageUrl);

        user.profileImage = imageUrl;
        await user.save();

        console.log('User updated with profile image:', user.profileImage);

        res.json({
            success: true,
            message: 'Image de profil mise à jour avec succès',
            data: {
                profileImage: imageUrl
            }
        });
    } catch (error) {
        console.error('Error in uploadProfileImage:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du téléchargement de l\'image',
            error: error.message
        });
    }
};

// Get expediteur data
exports.getExpediteurData = async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log('getExpediteurData - userId from params:', userId);
        console.log('getExpediteurData - req.user.id:', req.user.id);
        console.log('getExpediteurData - req.user.role:', req.user.role);
        console.log('getExpediteurData - userId type:', typeof userId);
        console.log('getExpediteurData - req.user.id type:', typeof req.user.id);
        console.log('getExpediteurData - userId toString:', userId.toString());
        console.log('getExpediteurData - req.user.id toString:', req.user.id.toString());

        // Check if user is requesting their own data or is admin
        const isOwnData = req.user.id.toString() === userId.toString();
        const isAdmin = req.user.role === 'admin';

        console.log('getExpediteurData - isOwnData:', isOwnData);
        console.log('getExpediteurData - isAdmin:', isAdmin);

        if (!isOwnData && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à accéder à ces données'
            });
        }

        const Expediteur = require('../models/Expediteur');
        let expediteur = await Expediteur.findOne({ userId });

        // If no expediteur data exists, create default data
        if (!expediteur) {
            expediteur = new Expediteur({
                userId,
                noteGlobale: 0,
                nombreEnvois: 0,
                nombreEvaluations: 0,
                adressePrincipale: {
                    rue: "",
                    ville: "",
                    codePostal: "",
                    pays: "Maroc"
                },
                isActive: true
            });
            await expediteur.save();
        }

        res.json({
            success: true,
            data: expediteur
        });
    } catch (error) {
        console.error('Error in getExpediteurData:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des données expéditeur',
            error: error.message
        });
    }
};

// Update expediteur data
exports.updateExpediteurData = async (req, res) => {
    try {
        // Check if user is expediteur
        if (req.user.role !== 'expediteur') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les expéditeurs peuvent modifier leurs données'
            });
        }

        const { adressePrincipale } = req.body;

        const Expediteur = require('../models/Expediteur');
        let expediteur = await Expediteur.findOne({ userId: req.user.id });

        // If no expediteur data exists, create it
        if (!expediteur) {
            expediteur = new Expediteur({
                userId: req.user.id,
                noteGlobale: 0,
                nombreEnvois: 0,
                nombreEvaluations: 0,
                adressePrincipale: adressePrincipale || {
                    rue: "",
                    ville: "",
                    codePostal: "",
                    pays: "Maroc"
                },
                isActive: true
            });
        } else {
            // Update existing data
            if (adressePrincipale) {
                expediteur.adressePrincipale = {
                    ...expediteur.adressePrincipale,
                    ...adressePrincipale
                };
            }
        }

        await expediteur.save();

        res.json({
            success: true,
            message: 'Données expéditeur mises à jour avec succès',
            data: expediteur
        });
    } catch (error) {
        console.error('Error in updateExpediteurData:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des données expéditeur',
            error: error.message
        });
    }
}; 