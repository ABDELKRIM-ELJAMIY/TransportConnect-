const mongoose = require('mongoose');

const statistiquesSchema = new mongoose.Schema({
    periode: {
        type: String,
        enum: ['journaliere', 'hebdomadaire', 'mensuelle', 'annuelle'],
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },

    utilisateurs: {
        total: { type: Number, default: 0 },
        nouveaux: { type: Number, default: 0 },
        actifs: { type: Number, default: 0 },
        conducteurs: { type: Number, default: 0 },
        expediteurs: { type: Number, default: 0 },
        verifices: { type: Number, default: 0 },
        suspendus: { type: Number, default: 0 }
    },

    annonces: {
        total: { type: Number, default: 0 },
        nouvelles: { type: Number, default: 0 },
        actives: { type: Number, default: 0 },
        completees: { type: Number, default: 0 },
        annulees: { type: Number, default: 0 },
        parType: {
            fragile: { type: Number, default: 0 },
            normale: { type: Number, default: 0 },
            dangereuse: { type: Number, default: 0 },
            alimentaire: { type: Number, default: 0 },
            electronique: { type: Number, default: 0 },
            autre: { type: Number, default: 0 }
        }
    },

    demandes: {
        total: { type: Number, default: 0 },
        nouvelles: { type: Number, default: 0 },
        acceptees: { type: Number, default: 0 },
        refusees: { type: Number, default: 0 },
        enCours: { type: Number, default: 0 },
        livrees: { type: Number, default: 0 },
        annulees: { type: Number, default: 0 }
    },

    
    taux: {
        acceptation: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },  
        satisfaction: { type: Number, default: 0 },
        retour: { type: Number, default: 0 }      
    },

    finances: {
        chiffreAffaires: { type: Number, default: 0 },
        moyennePrixAnnonce: { type: Number, default: 0 },
        transactionsMoyennes: { type: Number, default: 0 },
        commission: { type: Number, default: 0 }
    },

   
    geographie: {
        villesPopulaires: [{
            nom: String,
            count: Number
        }],
        routesPopulaires: [{
            depart: String,
            destination: String,
            count: Number
        }],
        distanceMoyenne: { type: Number, default: 0 }
    },

    
    activite: {
        heuresPointe: [{
            heure: Number,
            activite: Number
        }],
        joursActifs: [{
            jour: String,
            activite: Number
        }],
        saisonnalite: [{
            mois: Number,
            activite: Number
        }]
    },

    // Évaluations
    evaluations: {
        total: { type: Number, default: 0 },
        moyenne: { type: Number, default: 0 },
        parNote: {
            note1: { type: Number, default: 0 },
            note2: { type: Number, default: 0 },
            note3: { type: Number, default: 0 },
            note4: { type: Number, default: 0 },
            note5: { type: Number, default: 0 }
        }
    },

    
    engagement: {
        notificationsEnvoyees: { type: Number, default: 0 },
        tauxOuverture: { type: Number, default: 0 },
        tempsSessionMoyen: { type: Number, default: 0 }, 
        pagesVuesMoyennes: { type: Number, default: 0 }
    },

   
    support: {
        tickets: { type: Number, default: 0 },
        ticketsResolus: { type: Number, default: 0 },
        tempsResolutionMoyen: { type: Number, default: 0 }, 
        problemesCourants: [{
            type: String,
            count: Number
        }]
    },

    graphiques: {
        croissanceUtilisateurs: [Number],
        evolutionAnnonces: [Number],
        tauxActivite: [Number],
        revenus: [Number]
    },

    calculePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estFinalise: {
        type: Boolean,
        default: false
    },
    dureeCalcul: Number, 
    version: {
        type: String,
        default: '1.0'
    }

}, { timestamps: true });

statistiquesSchema.index({ periode: 1, dateDebut: -1 });
statistiquesSchema.index({ dateDebut: 1, dateFin: 1 });
statistiquesSchema.index({ createdAt: -1 });

statistiquesSchema.index({
    periode: 1,
    dateDebut: 1,
    dateFin: 1
}, { unique: true });

module.exports = mongoose.model('Statistiques', statistiquesSchema);