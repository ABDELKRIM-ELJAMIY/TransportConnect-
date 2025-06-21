const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/validation');
const trajetsRouter = require('./routes/trajets');

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express.static(path.join(__dirname, 'uploads')));

app.get('/test-uploads', (req, res) => {
    res.json({
        message: 'Uploads directory is accessible',
        uploadsPath: path.join(__dirname, 'uploads')
    });
});

app.get('/', (req, res) => {
    res.send('TransportConnect API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/annonces', require('./routes/annonces'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/trajets', trajetsRouter);
app.use('/api/historique', require('./routes/historique'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});