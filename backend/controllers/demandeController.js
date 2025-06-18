const DemandeTransport = require('../models/DemandeTransport');
const Annonce = require('../models/Annonce');
const User = require('../models/User');

exports.createDemande = async (req, res) => {
    try {
        const {
            annonceId,
            description,
            dimensions,
            poids,
            typeColis,
            valeurDeclaree,
            assuranceRequise,
            instructionsSpeciales,
            lieuRecuperation,
            lieuLivraison,
            contactRecuperation,
            contactLivraison,
            datePreferenceRecuperation,
            datePreferenceLivraison
        } = req.body;

        if (req.user.role !== 'expediteur') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les expéditeurs peuvent créer des demandes de transport'
            });
        }

        const annonce = await Annonce.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        if (annonce.statut !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cette annonce n\'est plus disponible'
            });
        }

        if (annonce.conducteurId.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas faire une demande sur votre propre annonce'
            });
        }

        const existingDemande = await DemandeTransport.findOne({
            expediteurId: req.user.id,
            annonceId: annonceId,
            statut: { $in: ['en_attente', 'acceptee'] }
        });

        if (existingDemande) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà une demande en cours pour cette annonce'
            });
        }

        if (poids > annonce.poidsMaximum) {
            return res.status(400).json({
                success: false,
                message: 'Le poids de votre colis dépasse la capacité maximale de cette annonce'
            });
        }

        if (!annonce.dimensions || !annonce.dimensions.longueurMax || !annonce.dimensions.largeurMax || !annonce.dimensions.hauteurMax) {
            return res.status(400).json({
                success: false,
                message: 'Les dimensions maximales de cette annonce ne sont pas définies'
            });
        }

        if (dimensions.longueur > annonce.dimensions.longueurMax ||
            dimensions.largeur > annonce.dimensions.largeurMax ||
            dimensions.hauteur > annonce.dimensions.hauteurMax) {
            return res.status(400).json({
                success: false,
                message: 'Les dimensions de votre colis dépassent les limites de cette annonce'
            });
        }

        const newDemande = new DemandeTransport({
            expediteurId: req.user.id,
            annonceId,
            description,
            dimensions,
            poids,
            typeColis,
            valeurDeclaree,
            assuranceRequise,
            instructionsSpeciales,
            lieuRecuperation,
            lieuLivraison,
            contactRecuperation,
            contactLivraison,
            datePreferenceRecuperation,
            datePreferenceLivraison
        });

        await newDemande.save();

        await newDemande.populate([
            { path: 'expediteurId', select: 'nom prenom email telephone' },
            { path: 'annonceId', populate: { path: 'conducteurId', select: 'nom prenom email telephone' } }
        ]);

        res.status(201).json({
            success: true,
            message: 'Demande de transport créée avec succès',
            data: newDemande
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la demande',
            error: error.message
        });
    }
};

exports.getMyDemandes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { expediteurId: req.user.id };

        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.typeColis) filter.typeColis = req.query.typeColis;

        const demandes = await DemandeTransport.find(filter)
            .populate([
                { path: 'expediteurId', select: 'nom prenom email telephone' },
                { path: 'annonceId', populate: { path: 'conducteurId', select: 'nom prenom email telephone' } }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DemandeTransport.countDocuments(filter);

        res.json({
            success: true,
            data: {
                demandes,
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
            message: 'Erreur lors de la récupération de vos demandes',
            error: error.message
        });
    }
};

exports.getDemandesByAnnonce = async (req, res) => {
    try {
        const annonceId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const annonce = await Annonce.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        if (annonce.conducteurId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à voir les demandes de cette annonce'
            });
        }

        const filter = { annonceId };

        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.typeColis) filter.typeColis = req.query.typeColis;

        const demandes = await DemandeTransport.find(filter)
            .populate([
                { path: 'expediteurId', select: 'nom prenom email telephone' },
                { path: 'annonceId', populate: { path: 'conducteurId', select: 'nom prenom email telephone' } }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DemandeTransport.countDocuments(filter);

        res.json({
            success: true,
            data: {
                demandes,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
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
            message: 'Erreur lors de la récupération des demandes',
            error: error.message
        });
    }
};

exports.updateDemandeStatus = async (req, res) => {
    try {
        const { statut, commentaire, raisonRefus } = req.body;
        const demandeId = req.params.id;

        const demande = await DemandeTransport.findById(demandeId)
            .populate('annonceId');

        if (!demande) {
            return res.status(404).json({
                success: false,
                message: 'Demande non trouvée'
            });
        }

        const annonce = demande.annonceId;
        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce associée non trouvée'
            });
        }

        if (annonce.conducteurId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier cette demande'
            });
        }

        if (demande.statut === 'livree' || demande.statut === 'annulee') {
            return res.status(400).json({
                success: false,
                message: 'Impossible de modifier une demande terminée'
            });
        }

        const validTransitions = {
            'en_attente': ['acceptee', 'refusee'],
            'acceptee': ['en_cours'],
            'en_cours': ['livree'],
            'refusee': [],
            'livree': [],
            'annulee': []
        };

        if (!validTransitions[demande.statut].includes(statut)) {
            return res.status(400).json({
                success: false,
                message: `Transition de statut invalide de "${demande.statut}" vers "${statut}"`
            });
        }

        demande.statut = statut;
        demande.dateReponse = new Date();

        if (commentaire) demande.commentaire = commentaire;
        if (raisonRefus && statut === 'refusee') demande.raisonRefus = raisonRefus;

        await demande.save();

        await demande.populate([
            { path: 'expediteurId', select: 'nom prenom email telephone' },
            { path: 'annonceId', populate: { path: 'conducteurId', select: 'nom prenom email telephone' } }
        ]);

        res.json({
            success: true,
            message: `Statut de la demande mis à jour vers "${statut}"`,
            data: demande
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID demande invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};

exports.deleteDemande = async (req, res) => {
    try {
        const demandeId = req.params.id;

        const demande = await DemandeTransport.findById(demandeId);

        if (!demande) {
            return res.status(404).json({
                success: false,
                message: 'Demande non trouvée'
            });
        }

        if (demande.expediteurId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à supprimer cette demande'
            });
        }

        if (demande.statut !== 'en_attente') {
            return res.status(400).json({
                success: false,
                message: 'Seules les demandes en attente peuvent être supprimées'
            });
        }

        await DemandeTransport.findByIdAndDelete(demandeId);

        res.json({
            success: true,
            message: 'Demande supprimée avec succès'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID demande invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la demande',
            error: error.message
        });
    }
}; 