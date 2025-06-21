const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    evaluateurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    evalueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trajetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trajet',
        required: false
    },
    annonceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: false
    },
    note: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    commentaire: {
        type: String,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['conducteur_vers_expediteur', 'expediteur_vers_conducteur'],
        required: true
    },
    criteres: {
        ponctualite: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        professionnalisme: { type: Number, min: 1, max: 5 },
        etatColis: { type: Number, min: 1, max: 5 },
        faciliteContact: { type: Number, min: 1, max: 5 },
        respectConsignes: { type: Number, min: 1, max: 5 }
    },
    recommande: {
        type: Boolean,
        default: true
    },
    estVisible: {
        type: Boolean,
        default: true
    },
    reponseEvalue: {
        commentaire: String,
        date: Date
    },
    signale: {
        type: Boolean,
        default: false
    },
    raisonSignalement: String
}, { timestamps: true });

evaluationSchema.index({
    evaluateurId: 1,
    evalueId: 1,
    trajetId: 1,
    type: 1
}, {
    unique: true,
    partialFilterExpression: { trajetId: { $exists: true } }
});

evaluationSchema.index({
    evaluateurId: 1,
    evalueId: 1,
    annonceId: 1,
    type: 1
}, {
    unique: true,
    partialFilterExpression: { annonceId: { $exists: true } }
});

evaluationSchema.index({ evalueId: 1 });
evaluationSchema.index({ evaluateurId: 1 });
evaluationSchema.index({ trajetId: 1 });
evaluationSchema.index({ annonceId: 1 });
evaluationSchema.index({ note: -1 });
evaluationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);