const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'demande_recue',
            'demande_acceptee',
            'demande_refusee',
            'trajet_commence',
            'trajet_termine',
            'colis_recupere',
            'colis_livre',
            'evaluation_recue',
            'compte_verifie',
            'compte_suspendu',
            'nouvelle_annonce',
            'rappel',
            'urgence',
            'system'
        ],
        required: true
    },
    donneesSupplement: {
        annonceId: mongoose.Schema.Types.ObjectId,
        trajetId: mongoose.Schema.Types.ObjectId,
        demandeId: mongoose.Schema.Types.ObjectId,
        colisId: mongoose.Schema.Types.ObjectId,
        evaluationId: mongoose.Schema.Types.ObjectId,
        url: String,
        actionBouton: String
    },
    estLue: {
        type: Boolean,
        default: false
    },
    dateLecture: Date,
    priorite: {
        type: String,
        enum: ['basse', 'normale', 'haute', 'urgente'],
        default: 'normale'
    },
    canalEnvoi: {
        type: String,
        enum: ['app', 'email', 'sms', 'push'],
        default: 'app'
    },
    estEnvoyee: {
        type: Boolean,
        default: false
    },
    dateEnvoiPrevue: Date,
    erreurEnvoi: String,
    nombreTentatives: {
        type: Number,
        default: 0
    },
    expireA: Date
}, { timestamps: true });

notificationSchema.index({ userId: 1, estLue: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priorite: 1 });
notificationSchema.index({ expireA: 1 }, { expireAfterSeconds: 0 }); 

notificationSchema.pre('save', function (next) {
    if (!this.expireA) {
        this.expireA = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);