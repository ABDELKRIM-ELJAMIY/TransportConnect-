const mongoose = require('mongoose');

const demandeTransportSchema = new mongoose.Schema({
    expediteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    annonceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dimensions: {
        longueur: { type: Number, required: true },
        largeur: { type: Number, required: true },
        hauteur: { type: Number, required: true }
    },
    poids: {
        type: Number,
        required: true
    },
    typeColis: {
        type: String,
        enum: ['fragile', 'normale', 'dangereuse', 'alimentaire', 'electronique', 'autre'],
        required: true
    },
    statut: {
        type: String,
        enum: ['en_attente', 'acceptee', 'refusee', 'en_cours', 'livree', 'annulee'],
        default: 'en_attente'
    },
    dateReponse: Date,
    commentaire: String,
    raisonRefus: String,
    valeurDeclaree: Number,
    assuranceRequise: {
        type: Boolean,
        default: false
    },
    instructionsSpeciales: String,
    lieuRecuperation: {
        nom: String,
        adresse: String,
        instructions: String
    },
    lieuLivraison: {
        nom: String,
        adresse: String,
        instructions: String
    },
    contactRecuperation: {
        nom: String,
        telephone: String
    },
    contactLivraison: {
        nom: String,
        telephone: String
    },
    datePreferenceRecuperation: Date,
    datePreferenceLivraison: Date
}, { timestamps: true });

demandeTransportSchema.index({ expediteurId: 1 });
demandeTransportSchema.index({ annonceId: 1 });
demandeTransportSchema.index({ statut: 1 });
demandeTransportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DemandeTransport', demandeTransportSchema);