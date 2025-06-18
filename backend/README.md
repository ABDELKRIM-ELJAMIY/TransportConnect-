# TransportConnect Backend API

## Authentification et Sécurité

### Endpoints d'Authentification

#### 1. POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "telephone": "0123456789",
  "password": "MotDePasse123!",
  "confirmPassword": "MotDePasse123!",
  "role": "conducteur"
}
```

**Réponse:**
```json
{
  "message": "Utilisateur créé avec succès"
}
```

#### 2. POST `/api/auth/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "role": "conducteur"
  }
}
```

#### 3. GET `/api/auth/me`
Récupération des informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "0123456789",
    "role": "conducteur",
    "dateCreation": "2023-09-06T10:30:00.000Z",
    "isActive": true
  }
}
```

### Middleware de Protection

#### 1. `protect`
Protège les routes en vérifiant la validité du token JWT.

```javascript
const { protect } = require('../middlewares/auth');

router.get('/protected-route', protect, (req, res) => {
  // Route protégée
});
```

#### 2. `authorizeRoles`
Vérifie que l'utilisateur a les rôles requis.

```javascript
const { authorizeRoles } = require('../middlewares/auth');

router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  // Route accessible uniquement aux admins
});

router.get('/conducteur-only', protect, authorizeRoles('conducteur'), (req, res) => {
  // Route accessible uniquement aux conducteurs
});
```

#### 3. `checkOwnership`
Vérifie que l'utilisateur est propriétaire de la ressource.

```javascript
const { checkOwnership } = require('../middlewares/auth');
const Annonce = require('../models/Annonce');

router.put('/annonces/:id', protect, checkOwnership(Annonce), (req, res) => {
  // Route accessible uniquement au propriétaire de l'annonce
});
```

### Validation des Données

#### 1. Validation d'Inscription
```javascript
const { validateRegister } = require('../middlewares/validation');

router.post('/register', validateRegister, register);
```

**Règles de validation:**
- Nom et prénom: 2-50 caractères, lettres uniquement
- Email: format valide, normalisé
- Téléphone: format français
- Mot de passe: 8 caractères minimum, complexité requise
- Confirmation de mot de passe: doit correspondre

#### 2. Validation de Connexion
```javascript
const { validateLogin } = require('../middlewares/validation');

router.post('/login', validateLogin, login);
```

#### 3. Validation de Mise à Jour de Profil
```javascript
const { validateProfileUpdate } = require('../middlewares/validation');

router.put('/profile', protect, validateProfileUpdate, updateProfile);
```

### Sécurité

#### 1. Rate Limiting
- **Authentification:** 5 tentatives par 15 minutes
- **Général:** 100 requêtes par 15 minutes

#### 2. Validation des Tokens
- Vérification de l'existence de l'utilisateur
- Vérification du statut actif du compte
- Gestion des tokens expirés

#### 3. Gestion d'Erreurs
- Erreurs de validation formatées
- Messages d'erreur sécurisés
- Logs d'erreurs détaillés

### Tests

Pour tester l'API d'authentification:

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev

# Dans un autre terminal, exécuter les tests
node test-auth.js
```

### Variables d'Environnement

Créer un fichier `.env` à la racine du backend:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transportconnect
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=development
```

### Structure des Réponses

Toutes les réponses suivent un format standard:

**Succès:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

**Erreur:**
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide",
      "value": "invalid-email"
    }
  ]
}
```

### Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `429` - Trop de requêtes
- `500` - Erreur serveur 