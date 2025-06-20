const Trajet = require('../models/Trajet');

exports.commencerTrajet = async (req, res) => {
    try {
        const trajet = await Trajet.findById(req.params.id);
        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé' });
        trajet.statut = 'en_cours';
        trajet.dateDepartReelle = new Date();
        await trajet.save();
        res.json({ success: true, message: 'Trajet commencé', data: trajet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors du démarrage du trajet', error: error.message });
    }
};

exports.terminerTrajet = async (req, res) => {
    try {
        const trajet = await Trajet.findById(req.params.id);
        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé' });
        trajet.statut = 'termine';
        trajet.dateArriveeReelle = new Date();
        await trajet.save();
        res.json({ success: true, message: 'Trajet terminé', data: trajet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la terminaison du trajet', error: error.message });
    }
};

exports.annulerTrajet = async (req, res) => {
    try {
        const trajet = await Trajet.findById(req.params.id);
        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé' });
        trajet.statut = 'annule';
        await trajet.save();
        res.json({ success: true, message: 'Trajet annulé', data: trajet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de l\'annulation du trajet', error: error.message });
    }
};

exports.suivreTrajet = async (req, res) => {
    try {
        const trajet = await Trajet.findById(req.params.id);
        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé' });
        res.json({
            success: true, data: {
                positionActuelle: trajet.positionActuelle,
                historiquePositions: trajet.historiquePositions
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors du suivi du trajet', error: error.message });
    }
};

exports.getTrajetByAnnonceId = async (req, res) => {
    try {
        const trajet = await Trajet.findOne({ annonceId: req.params.annonceId });
        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé pour cette annonce' });
        res.json({ success: true, data: trajet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du trajet', error: error.message });
    }
}; 