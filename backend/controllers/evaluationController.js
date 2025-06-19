const Evaluation = require('../models/Evaluation');
const Trajet = require('../models/Trajet');
const User = require('../models/User');

exports.createEvaluation = async (req, res) => {
    try {
        const {
            evalueId,
            trajetId,
            note,
            commentaire,
            type,
            criteres,
            recommande
        } = req.body;

        
        if (req.user.id === evalueId) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas vous évaluer vous-même.'
            });
        }

        const existing = await Evaluation.findOne({
            evaluateurId: req.user.id,
            evalueId,
            trajetId,
            type
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà évalué cet utilisateur pour ce trajet.'
            });
        }


        const evaluation = new Evaluation({
            evaluateurId: req.user.id,
            evalueId,
            trajetId,
            note,
            commentaire,
            type,
            criteres,
            recommande
        });
        await evaluation.save();

        res.status(201).json({
            success: true,
            message: 'Évaluation enregistrée avec succès',
            data: evaluation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'évaluation',
            error: error.message
        });
    }
};

exports.getEvaluationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const evaluations = await Evaluation.find({ evalueId: userId }).populate('evaluateurId', 'nom prenom');
        res.status(200).json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des évaluations de l'utilisateur",
            error: error.message
        });
    }
}; 