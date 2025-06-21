const Annonce = require('../models/Annonce');
const Evaluation = require('../models/Evaluation');
const DemandeTransport = require('../models/DemandeTransport');
const Notification = require('../models/Notification');

exports.getHistorique = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch completed/cancelled annonces
        const annonces = await Annonce.find({
            conducteurId: userId,
            statut: { $in: ['complete', 'annulee'] }
        }).sort({ dateArrivee: -1 });

        // 2. Fetch evaluations for the user
        const evaluations = await Evaluation.find({ evalueId: userId })
            .populate('evaluateurId', 'prenom nom')
            .sort({ createdAt: -1 });

        // 3. Fetch transport demands (as conductor) that are completed (livree or refusee)
        const demandes = await DemandeTransport.find({
            statut: { $in: ['livree', 'refusee'] }
        })
            .populate('expediteurId', 'prenom nom')
            .populate({
                path: 'annonceId',
                match: { conducteurId: userId },
                populate: { path: 'conducteurId', select: 'nom prenom email telephone' }
            })
            .sort({ dateReponse: -1, createdAt: -1 });

        console.log('historiqueController - all demandes with status livree/refusee:', demandes.length);
        console.log('historiqueController - demandes details:', demandes.map(d => ({
            id: d._id,
            statut: d.statut,
            hasAnnonce: !!d.annonceId,
            annonceConducteurId: d.annonceId?.conducteurId?._id
        })));

        // Filter out demandes where the annonce doesn't belong to the current user
        const filteredDemandes = demandes.filter(demande => demande.annonceId);

        console.log('historiqueController - filtered demandes for user:', filteredDemandes.length);

        // 4. Fetch notifications
        const notifications = await Notification.find({
            destinataireId: userId
        }).sort({ createdAt: -1 });

        // 5. Map to history items
        const tripItems = annonces.map(a => ({
            id: a._id,
            type: "trip",
            title: `Trajet ${a.lieuDepart?.nom || ''} → ${a.destination?.nom || ''}`,
            description: a.statut === 'complete' ? "Trajet terminé avec succès" : "Trajet annulé",
            date: a.dateArrivee ? new Date(a.dateArrivee).toLocaleDateString('fr-FR') : '',
            time: a.dateArrivee ? new Date(a.dateArrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            status: a.statut === 'complete' ? 'completed' : 'cancelled',
            earnings: a.prix,
            icon: 'Truck'
        }));

        const ratingItems = evaluations.map(e => ({
            id: e._id,
            type: "rating",
            title: "Nouvel avis reçu",
            description: `${e.note} étoiles de ${e.evaluateurId?.prenom || ''} ${e.evaluateurId?.nom || ''}`,
            date: e.createdAt ? new Date(e.createdAt).toLocaleDateString('fr-FR') : '',
            time: e.createdAt ? new Date(e.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            status: e.note >= 4 ? 'positive' : 'completed',
            rating: e.note,
            icon: 'Star'
        }));

        const demandItems = filteredDemandes.map(d => ({
            id: d._id,
            type: "demand",
            title: `Demande de transport ${d.statut === 'livree' ? 'livrée' : 'refusée'}`,
            description: `Demande de ${d.expediteurId?.prenom || ''} ${d.expediteurId?.nom || ''} - ${d.annonceId?.lieuDepart?.nom || ''} → ${d.annonceId?.destination?.nom || ''}`,
            date: d.dateReponse ? new Date(d.dateReponse).toLocaleDateString('fr-FR') : (d.createdAt ? new Date(d.createdAt).toLocaleDateString('fr-FR') : ''),
            time: d.dateReponse ? new Date(d.dateReponse).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : (d.createdAt ? new Date(d.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''),
            status: d.statut === 'livree' ? 'completed' : d.statut === 'refusee' ? 'cancelled' : 'in_progress',
            icon: 'Package'
        }));

        const notificationItems = notifications.map(n => ({
            id: n._id,
            type: "notification",
            title: n.titre || "Nouvelle notification",
            description: n.contenu || n.message || "Vous avez reçu une nouvelle notification",
            date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : '',
            time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            status: n.lu ? 'completed' : 'active',
            icon: 'Bell'
        }));

        // 6. Combine and sort
        const historyData = [...tripItems, ...ratingItems, ...demandItems, ...notificationItems].sort((a, b) => {
            const dateA = a.date ? new Date(a.date.split('/').reverse().join('-') + 'T' + a.time) : new Date(0);
            const dateB = b.date ? new Date(b.date.split('/').reverse().join('-') + 'T' + b.time) : new Date(0);
            return dateB - dateA;
        });

        res.json({
            success: true,
            data: historyData
        });

    } catch (err) {
        console.error("Historique fetch error:", err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du chargement de l\'historique.',
            error: err.message
        });
    }
}; 