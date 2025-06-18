const mongoose = require('mongoose');

const conducteurSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    permisConduire: {
        type: String,
        required: true
    },
    vehicule: {
        marque: String,
        modele: String,
        annee: Number,
        couleur: String,
        immatriculation: String,
        capaciteMax: Number,
        volumeMax: Number 
    },
    noteGlobale: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    nombreVoyages: {
        type: Number,
        default: 0
    },
    nombreEvaluations: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

conducteurSchema.index({ userId: 1 });
conducteurSchema.index({ noteGlobale: -1 });

module.exports = mongoose.model('Conducteur', conducteurSchema);