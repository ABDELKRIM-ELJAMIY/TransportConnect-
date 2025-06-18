const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    conducteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lieuDepart: {
        nom: { type: String, required: true },
        latitude: Number,
        longitude: Number,
        adresse: String
    },
    destination: {
        nom: { type: String, required: true },
        latitude: Number,
        longitude: Number,
        adresse: String
    },
    etapesIntermediaires: [{
        nom: String,
        latitude: Number,
        longitude: Number,
        adresse: String,
        ordre: Number
    }],
    dateDepart: {
        type: Date,
        required: true
    },
    dateArrivee: Date,
    dimensions: {
        longueurMax: { type: Number, required: true },
        largeurMax: { type: Number, required: true },
        hauteurMax: { type: Number, required: true }
    },
    poidsMaximum: {
        type: Number,
        required: true
    },
    typeMarchandise: {
        type: String,
        enum: ['fragile', 'normale', 'dangereuse', 'alimentaire', 'electronique', 'autre'],
        default: 'normale'
    },
    capaciteDisponible: {
        type: Number,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: ['active', 'complete', 'annulee', 'suspendue'],
        default: 'active'
    },
    conditions: {
        accepteAnimaux: { type: Boolean, default: false },
        fumeurAccepte: { type: Boolean, default: false },
        conditionsSpeciales: String
    },
    nombrePlacesDisponibles: {
        type: Number,
        default: 1
    },
    isUrgent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

annonceSchema.index({ conducteurId: 1 });
annonceSchema.index({ statut: 1 });
annonceSchema.index({ dateDepart: 1 });
annonceSchema.index({ 'lieuDepart.nom': 1, 'destination.nom': 1 });
annonceSchema.index({ typeMarchandise: 1 });
annonceSchema.index({ prix: 1 });

module.exports = mongoose.model('Annonce', annonceSchema);