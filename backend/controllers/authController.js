const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nom, prenom, email, telephone, password, role } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nom, prenom, email, telephone, password: hashedPassword, role
        });

        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email invalide" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                telephone: user.telephone,
                role: user.role,
                dateCreation: user.dateCreation,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};