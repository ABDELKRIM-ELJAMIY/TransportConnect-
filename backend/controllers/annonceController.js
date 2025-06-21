const Annonce = require('../models/Annonce');
const User = require('../models/User');
const Trajet = require('../models/Trajet');

exports.createAnnonce = async (req, res) => {
    try {
        const {
            lieuDepart,
            destination,
            etapesIntermediaires,
            dateDepart,
            dateArrivee,
            dimensions,
            poidsMaximum,
            typeMarchandise,
            capaciteDisponible,
            prix,
            conditions,
            nombrePlacesDisponibles,
            isUrgent
        } = req.body;

        if (req.user.role !== 'conducteur') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les conducteurs peuvent créer des annonces'
            });
        }

        let etapes = etapesIntermediaires || [];
        if (Array.isArray(etapes) && etapes.length > 0 && typeof etapes[0] === 'string') {
            etapes = etapes.map((etape, idx) => ({ nom: etape, ordre: idx + 1 }));
        }

        const newAnnonce = new Annonce({
            conducteurId: req.user.id,
            lieuDepart,
            destination,
            etapesIntermediaires: etapes,
            dateDepart,
            dateArrivee,
            dimensions,
            poidsMaximum,
            typeMarchandise,
            capaciteDisponible,
            prix,
            conditions: conditions || {},
            nombrePlacesDisponibles: nombrePlacesDisponibles || 1,
            isUrgent: isUrgent || false
        });

        await newAnnonce.save();

        await newAnnonce.populate('conducteurId', 'nom prenom email telephone');

        res.status(201).json({
            success: true,
            message: 'Annonce créée avec succès',
            data: newAnnonce
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'annonce',
            error: error.message
        });
    }
};

exports.getAllAnnonces = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { statut: 'active' };

        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.typeMarchandise) filter.typeMarchandise = req.query.typeMarchandise;
        if (req.query.isUrgent !== undefined) filter.isUrgent = req.query.isUrgent === 'true';

        if (req.query.dateDepartFrom) {
            filter.dateDepart = { $gte: new Date(req.query.dateDepartFrom) };
        }
        if (req.query.dateDepartTo) {
            if (filter.dateDepart) {
                filter.dateDepart.$lte = new Date(req.query.dateDepartTo);
            } else {
                filter.dateDepart = { $lte: new Date(req.query.dateDepartTo) };
            }
        }

        if (req.query.prixMin || req.query.prixMax) {
            filter.prix = {};
            if (req.query.prixMin) filter.prix.$gte = parseFloat(req.query.prixMin);
            if (req.query.prixMax) filter.prix.$lte = parseFloat(req.query.prixMax);
        }

        if (req.query.lieuDepart) {
            filter['lieuDepart.nom'] = { $regex: req.query.lieuDepart, $options: 'i' };
        }
        if (req.query.destination) {
            filter['destination.nom'] = { $regex: req.query.destination, $options: 'i' };
        }

        if (req.query.poidsMin) {
            filter.poidsMaximum = { $gte: parseFloat(req.query.poidsMin) };
        }

        const annonces = await Annonce.find(filter)
            .populate('conducteurId', 'nom prenom email telephone')
            .sort({ createdAt: -1, isUrgent: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Annonce.countDocuments(filter);

        res.json({
            success: true,
            data: {
                annonces,
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
            message: 'Erreur lors de la récupération des annonces',
            error: error.message
        });
    }
};

exports.getAnnonceById = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id)
            .populate('conducteurId', 'nom prenom email telephone');

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        res.json({
            success: true,
            data: annonce
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID annonce invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'annonce',
            error: error.message
        });
    }
};

exports.updateAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        if (annonce.conducteurId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier cette annonce'
            });
        }

        if (annonce.statut === 'complete' || annonce.statut === 'annulee') {
            return res.status(400).json({
                success: false,
                message: 'Impossible de modifier une annonce terminée ou annulée'
            });
        }

        const updatedAnnonce = await Annonce.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('conducteurId', 'nom prenom email telephone');

        res.json({
            success: true,
            message: 'Annonce mise à jour avec succès',
            data: updatedAnnonce
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID annonce invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'annonce',
            error: error.message
        });
    }
};

exports.deleteAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        if (annonce.conducteurId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à supprimer cette annonce'
            });
        }

        annonce.statut = 'annulee';
        await annonce.save();

        // Delete associated trajet
        await Trajet.deleteOne({ annonceId: annonce._id });

        res.json({
            success: true,
            message: 'Annonce et trajet associé supprimés avec succès'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID annonce invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'annonce',
            error: error.message
        });
    }
};

exports.completeAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        if (annonce.conducteurId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier cette annonce'
            });
        }

        if (annonce.statut !== 'active') {
            return res.status(400).json({
                success: false,
                message: `Impossible de marquer comme terminée une annonce qui est déjà ${annonce.statut}`
            });
        }

        annonce.statut = 'complete';
        annonce.dateArrivee = new Date(); // Set arrival date on completion
        await annonce.save();

        res.json({
            success: true,
            message: 'Annonce marquée comme terminée avec succès',
            data: annonce
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la finalisation de l\'annonce',
            error: error.message
        });
    }
};

exports.getMyAnnonces = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { conducteurId: req.user.id };

        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.typeMarchandise) filter.typeMarchandise = req.query.typeMarchandise;
        if (req.query.isUrgent !== undefined) filter.isUrgent = req.query.isUrgent === 'true';

        const annonces = await Annonce.find(filter)
            .populate('conducteurId', 'nom prenom email telephone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Annonce.countDocuments(filter);

        res.json({
            success: true,
            data: {
                annonces,
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
            message: 'Erreur lors de la récupération de vos annonces',
            error: error.message
        });
    }
}; 