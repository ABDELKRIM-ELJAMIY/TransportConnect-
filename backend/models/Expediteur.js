const mongoose = require('mongoose');

const expediteurSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    noteGlobale: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    nombreEnvois: {
        type: Number,
        default: 0
    },
    nombreEvaluations: {
        type: Number,
        default: 0
    },
    adressePrincipale: {
        rue: String,
        ville: String,
        codePostal: String,
        pays: { type: String, default: 'France' }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

expediteurSchema.index({ userId: 1 });
expediteurSchema.index({ noteGlobale: -1 });

module.exports = mongoose.model('Expediteur', expediteurSchema);