const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
    annonceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: true
    },
    conducteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conducteur',
        required: true
    },
    demandesAcceptees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemandeTransport'
    }],
    dateDepart: {
        type: Date,
        required: true
    },
    dateArriveeReelle: Date,
    dateDepartReelle: Date,
    statut: {
        type: String,
        enum: ['planifie', 'en_cours', 'termine', 'annule', 'reporte'],
        default: 'planifie'
    },
    commentaireConducteur: String,
    commentaireExpediteur: String,
    kilometrage: {
        debut: Number,
        fin: Number,
        total: Number
    },
    coutCarburant: Number,
    peages: Number,
    autresFreis: Number,
    incidents: [{
        type: String,
        description: String,
        date: Date,
        gravite: {
            type: String,
            enum: ['faible', 'moyenne', 'elevee']
        }
    }],
    positionActuelle: {
        latitude: Number,
        longitude: Number,
        timestamp: Date
    },
    historiquePositions: [{
        latitude: Number,
        longitude: Number,
        timestamp: Date
    }],
    evaluationGlobale: {
        type: Number,
        min: 1,
        max: 5
    }
}, { timestamps: true });

trajetSchema.index({ annonceId: 1 });
trajetSchema.index({ conducteurId: 1 });
trajetSchema.index({ statut: 1 });
trajetSchema.index({ dateDepart: 1 });

module.exports = mongoose.model('Trajet', trajetSchema);