const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: { type: String, unique: true, required: true },
    telephone: String,
    password: { type: String, required: true },
    profileImage: String,
    role: {
        type: String,
        enum: ['conducteur', 'expediteur', 'admin'],
        default: 'expediteur',
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);