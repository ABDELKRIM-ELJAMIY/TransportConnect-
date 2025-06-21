const Evaluation = require('../models/Evaluation');
const Trajet = require('../models/Trajet');
const User = require('../models/User');

exports.createEvaluation = async (req, res) => {
    try {
        const {
            evalueId,
            trajetId,
            annonceId,
            note,
            commentaire,
            type,
            criteres,
            recommande
        } = req.body;

        if (!evalueId || !note || !type) {
            return res.status(400).json({
                success: false,
                message: 'evalueId, note, et type sont requis.'
            });
        }

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
        const evaluations = await Evaluation.find({ evalueId: userId })
            .populate('evaluateurId', 'nom prenom')
            .populate('trajetId')
            .populate('annonceId')
            .sort({ createdAt: -1 });
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

exports.replyToEvaluation = async (req, res) => {
    try {
        const { evaluationId } = req.params;
        const { reponseEvalue } = req.body;

        // Find the evaluation
        const evaluation = await Evaluation.findById(evaluationId);
        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée'
            });
        }

        // Check if the user is the one being evaluated
        if (evaluation.evalueId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à répondre à cette évaluation'
            });
        }

        // Check if already replied
        if (evaluation.reponseEvalue) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà répondu à cette évaluation'
            });
        }

        // Update the evaluation with the reply
        evaluation.reponseEvalue = reponseEvalue;
        await evaluation.save();

        res.status(200).json({
            success: true,
            message: 'Réponse enregistrée avec succès',
            data: evaluation
        });
    } catch (error) {
        console.error('Reply to evaluation error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'enregistrement de la réponse',
            error: error.message
        });
    }
}; 