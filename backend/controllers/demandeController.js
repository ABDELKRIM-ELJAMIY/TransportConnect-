const DemandeTransport = require('../models/DemandeTransport');
const Annonce = require('../models/Annonce');
const User = require('../models/User');

exports.createDemande = async (req, res) => {
    try {
        const {
            annonceId,
            description,
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

        // Use annonce data for package details
        const dimensions = {
            longueur: annonce.dimensions?.longueurMax || 0,
            largeur: annonce.dimensions?.largeurMax || 0,
            hauteur: annonce.dimensions?.hauteurMax || 0
        };
        const poids = annonce.poidsMaximum || 0;
        const typeColis = annonce.typeMarchandise || 'normale';
        const valeurDeclaree = 0; // Default value since annonce doesn't have this

        const newDemande = new DemandeTransport({
            expediteurId: req.user.id,
            annonceId,
            description,
            dimensions,
            poids,
            typeColis,
            valeurDeclaree,
            assuranceRequise: assuranceRequise || false,
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

        console.log('getDemandesByAnnonce - annonceId:', annonceId);
        console.log('getDemandesByAnnonce - req.user:', req.user);

        const annonce = await Annonce.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        console.log('getDemandesByAnnonce - annonce.conducteurId:', annonce.conducteurId);
        console.log('getDemandesByAnnonce - req.user.id:', req.user.id);
        console.log('getDemandesByAnnonce - conducteurId type:', typeof annonce.conducteurId);
        console.log('getDemandesByAnnonce - req.user.id type:', typeof req.user.id);
        console.log('getDemandesByAnnonce - conducteurId toString:', annonce.conducteurId.toString());
        console.log('getDemandesByAnnonce - req.user.id toString:', req.user.id.toString());

        // Check if user is the conducteur of this annonce or an admin
        const isConducteur = annonce.conducteurId.toString() === req.user.id.toString();
        const isAdmin = req.user.role === 'admin';

        console.log('getDemandesByAnnonce - isConducteur:', isConducteur);
        console.log('getDemandesByAnnonce - isAdmin:', isAdmin);

        if (!isConducteur && !isAdmin) {
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
        console.error('getDemandesByAnnonce error:', error);

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

        console.log('updateDemandeStatus - demandeId:', demandeId);
        console.log('updateDemandeStatus - req.user:', req.user);

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

        console.log('updateDemandeStatus - annonce.conducteurId:', annonce.conducteurId);
        console.log('updateDemandeStatus - req.user.id:', req.user.id);
        console.log('updateDemandeStatus - conducteurId type:', typeof annonce.conducteurId);
        console.log('updateDemandeStatus - req.user.id type:', typeof req.user.id);
        console.log('updateDemandeStatus - conducteurId toString:', annonce.conducteurId.toString());
        console.log('updateDemandeStatus - req.user.id toString:', req.user.id.toString());

        // Check if user is the conducteur of this annonce or an admin
        const isConducteur = annonce.conducteurId.toString() === req.user.id.toString();
        const isAdmin = req.user.role === 'admin';

        console.log('updateDemandeStatus - isConducteur:', isConducteur);
        console.log('updateDemandeStatus - isAdmin:', isAdmin);

        if (!isConducteur && !isAdmin) {
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
        console.error('updateDemandeStatus error:', error);

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

exports.getMyDemandesAsConducteur = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log('getMyDemandesAsConducteur - req.user:', req.user);

        // First, get all annonces created by this conducteur
        const annonces = await Annonce.find({ conducteurId: req.user.id }).select('_id');
        const annonceIds = annonces.map(annonce => annonce._id);

        console.log('getMyDemandesAsConducteur - annonceIds:', annonceIds);

        if (annonceIds.length === 0) {
            return res.json({
                success: true,
                data: {
                    demandes: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        pages: 0
                    }
                }
            });
        }

        const filter = { annonceId: { $in: annonceIds } };

        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.typeColis) filter.typeColis = req.query.typeColis;

        // Exclude demandes that are completed (livree or refusee) - they go to historique
        filter.statut = { $nin: ['livree', 'refusee'] };

        console.log('getMyDemandesAsConducteur - filter:', JSON.stringify(filter, null, 2));

        const demandes = await DemandeTransport.find(filter)
            .populate([
                { path: 'expediteurId', select: 'nom prenom email telephone' },
                { path: 'annonceId', populate: { path: 'conducteurId', select: 'nom prenom email telephone' } }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log('getMyDemandesAsConducteur - found demandes:', demandes.length);
        console.log('getMyDemandesAsConducteur - demandes statuts:', demandes.map(d => ({ id: d._id, statut: d.statut, inHistorique: d.inHistorique })));

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
        console.error('getMyDemandesAsConducteur error:', error);

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des demandes',
            error: error.message
        });
    }
};

exports.migrateHistoriqueDemandes = async (req, res) => {
    try {
        console.log('Starting migration of historique demandes...');

        // Find all demandes that are livree or refusee but don't have inHistorique flag
        const demandesToMigrate = await DemandeTransport.find({
            statut: { $in: ['livree', 'refusee'] },
            inHistorique: { $ne: true }
        });

        console.log(`Found ${demandesToMigrate.length} demandes to migrate`);

        let updatedCount = 0;
        for (const demande of demandesToMigrate) {
            demande.inHistorique = true;
            demande.dateFin = demande.dateReponse || demande.updatedAt || demande.createdAt;
            await demande.save();
            updatedCount++;
        }

        console.log(`Successfully migrated ${updatedCount} demandes to historique`);

        res.json({
            success: true,
            message: `Migration terminée. ${updatedCount} demandes déplacées vers l'historique.`,
            data: {
                totalFound: demandesToMigrate.length,
                updated: updatedCount
            }
        });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la migration',
            error: error.message
        });
    }
};