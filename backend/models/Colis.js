const mongoose = require('mongoose');

const colisSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true
    },
    trajetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trajet',
        required: true
    },
    demandeTransportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemandeTransport',
        required: true
    },
    expediteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expediteur',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    poids: {
        type: Number,
        required: true
    },
    dimensions: {
        longueur: { type: Number, required: true },
        largeur: { type: Number, required: true },  
        hauteur: { type: Number, required: true }   
    },
    type: {
        type: String,
        enum: ['fragile', 'normale', 'dangereuse', 'alimentaire', 'electronique', 'autre'],
        required: true
    },
    statut: {
        type: String,
        enum: ['en_attente_recuperation', 'recupere', 'en_transit', 'en_livraison', 'livre', 'perdu', 'endommage', 'refuse'],
        default: 'en_attente_recuperation'
    },
    dateExpedition: Date,
    dateLivraison: Date,
    dateRecuperation: Date,
    valeurDeclaree: Number, 
    photos: [{
        url: String,
        description: String,
        dateUpload: Date,
        type: {
            type: String,
            enum: ['avant_recuperation', 'apres_recuperation', 'en_transit', 'avant_livraison', 'apres_livraison', 'dommage']
        }
    }],
    signatureRecuperation: {
        nom: String,
        signature: String, 
        date: Date
    },
    signatureLivraison: {
        nom: String,
        signature: String, 
        date: Date
    },
    historiqueStatuts: [{
        statut: String,
        date: Date,
        commentaire: String,
        position: {
            latitude: Number,
            longitude: Number
        }
    }],
    problemes: [{
        type: {
            type: String,
            enum: ['retard', 'dommage', 'perte', 'refus_livraison', 'autre']
        },
        description: String,
        date: Date,
        resolu: { type: Boolean, default: false },
        solution: String
    }],
    codeRecuperation: String,
    codeLivraison: String
}, { timestamps: true });

colisSchema.pre('save', function (next) {
    if (!this.reference) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        this.reference = `COL-${timestamp}-${random}`.toUpperCase();
    }
    next();
});

colisSchema.index({ reference: 1 });
colisSchema.index({ trajetId: 1 });
colisSchema.index({ demandeTransportId: 1 });
colisSchema.index({ expediteurId: 1 });
colisSchema.index({ statut: 1 });
colisSchema.index({ dateExpedition: 1 });

module.exports = mongoose.model('Colis', colisSchema);